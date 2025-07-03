#!/bin/bash
# Deploy Script para AfiliadosBet em VPS AlmaLinux com Webmin
# Execução: bash deploy-vps.sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando deploy do AfiliadosBet em VPS AlmaLinux...${NC}"

# Função para logging
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

# Verificar se está rodando como root
if [[ $EUID -ne 0 ]]; then
   error "Este script deve ser executado como root (use sudo)"
fi

# Configurações do projeto
PROJECT_NAME="afiliadosbet"
PROJECT_DIR="/var/www/${PROJECT_NAME}"
DB_NAME="${PROJECT_NAME}_db"
DB_USER="${PROJECT_NAME}_user"
DB_PASSWORD=$(openssl rand -base64 32)
DOMAIN=${1:-"localhost"}
PORT=${2:-5000}

log "Configurações do Deploy:"
echo "  - Projeto: $PROJECT_NAME"
echo "  - Diretório: $PROJECT_DIR"
echo "  - Domínio: $DOMAIN"
echo "  - Porta: $PORT"
echo "  - Banco: $DB_NAME"

# 1. Atualizar sistema
log "Atualizando sistema AlmaLinux..."
dnf update -y
dnf install -y epel-release

# 2. Instalar dependências essenciais
log "Instalando dependências essenciais..."
dnf install -y \
    curl \
    wget \
    git \
    nginx \
    postgresql \
    postgresql-server \
    postgresql-contrib \
    firewalld \
    certbot \
    python3-certbot-nginx \
    htop \
    unzip

# 3. Instalar Node.js 20
log "Instalando Node.js 20..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

# Verificar instalação do Node.js
node_version=$(node -v)
npm_version=$(npm -v)
log "Node.js instalado: $node_version"
log "NPM instalado: $npm_version"

# 4. Instalar PM2 globalmente
log "Instalando PM2..."
npm install -g pm2

# 5. Configurar PostgreSQL
log "Configurando PostgreSQL..."
if [ ! -f /var/lib/pgsql/data/postgresql.conf ]; then
    postgresql-setup --initdb
fi

systemctl enable postgresql
systemctl start postgresql

# Criar usuário e banco de dados
log "Criando banco de dados..."
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME};"
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
sudo -u postgres psql -c "ALTER USER ${DB_USER} CREATEDB;"

# 6. Configurar firewall
log "Configurando firewall..."
systemctl enable firewalld
systemctl start firewalld
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --permanent --add-port=${PORT}/tcp
firewall-cmd --permanent --add-port=10000/tcp  # Webmin
firewall-cmd --reload

# 7. Instalar Webmin
log "Instalando Webmin..."
cat > /etc/yum.repos.d/webmin.repo << EOF
[Webmin]
name=Webmin Distribution Neutral
baseurl=https://download.webmin.com/download/yum
enabled=1
gpgcheck=1
gpgkey=https://download.webmin.com/jcameron-key.asc
EOF

dnf install -y webmin

# Configurar Webmin
systemctl enable webmin
systemctl start webmin

# 8. Criar diretório do projeto
log "Preparando diretório do projeto..."
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# 9. Clonar ou copiar projeto (assumindo que já existe)
# Se for upload manual, pule esta etapa
log "Preparando estrutura do projeto..."
mkdir -p {client,server,shared,logs}

# 10. Criar arquivo de configuração do ambiente
log "Criando arquivo de ambiente..."
cat > $PROJECT_DIR/.env << EOF
NODE_ENV=production
PORT=${PORT}
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}
SESSION_SECRET=$(openssl rand -base64 64)
PGHOST=localhost
PGPORT=5432
PGUSER=${DB_USER}
PGPASSWORD=${DB_PASSWORD}
PGDATABASE=${DB_NAME}
EOF

# 11. Configurar Nginx
log "Configurando Nginx..."
cat > /etc/nginx/conf.d/${PROJECT_NAME}.conf << EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    
    location / {
        proxy_pass http://localhost:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Servir arquivos estáticos diretamente
    location /assets/ {
        alias ${PROJECT_DIR}/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
EOF

# 12. Configurar PM2
log "Criando configuração do PM2..."
cat > $PROJECT_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '${PROJECT_NAME}',
    script: 'server/index.js',
    cwd: '${PROJECT_DIR}',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: ${PORT}
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: ${PORT}
    },
    error_file: '${PROJECT_DIR}/logs/err.log',
    out_file: '${PROJECT_DIR}/logs/out.log',
    log_file: '${PROJECT_DIR}/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# 13. Criar script de build
log "Criando script de build..."
cat > $PROJECT_DIR/build.sh << EOF
#!/bin/bash
cd ${PROJECT_DIR}

echo "🔄 Instalando dependências..."
npm ci --production=false

echo "🔨 Fazendo build do projeto..."
npm run build

echo "🗄️ Executando push do banco..."
npm run db:push

echo "✅ Build concluído!"
EOF

chmod +x $PROJECT_DIR/build.sh

# 14. Criar script de deploy
cat > $PROJECT_DIR/deploy.sh << EOF
#!/bin/bash
cd ${PROJECT_DIR}

echo "🔄 Fazendo build..."
./build.sh

echo "🔄 Reiniciando aplicação..."
pm2 restart ${PROJECT_NAME} || pm2 start ecosystem.config.js

echo "🔄 Reiniciando Nginx..."
systemctl reload nginx

echo "✅ Deploy concluído!"
EOF

chmod +x $PROJECT_DIR/deploy.sh

# 15. Configurar serviços
log "Habilitando serviços..."
systemctl enable nginx
systemctl start nginx
systemctl enable postgresql

# 16. Criar usuário do sistema para o projeto
log "Criando usuário do sistema..."
useradd -r -s /bin/false ${PROJECT_NAME} || true
chown -R ${PROJECT_NAME}:${PROJECT_NAME} $PROJECT_DIR

# 17. Configurar SSL (Let's Encrypt) se não for localhost
if [ "$DOMAIN" != "localhost" ]; then
    log "Configurando SSL com Let's Encrypt..."
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
fi

# 18. Salvar informações importantes
log "Salvando informações do deploy..."
cat > $PROJECT_DIR/DEPLOY_INFO.txt << EOF
=== INFORMAÇÕES DO DEPLOY ===
Data: $(date)
Servidor: AlmaLinux
Projeto: $PROJECT_NAME
Diretório: $PROJECT_DIR
Domínio: $DOMAIN
Porta: $PORT

=== BANCO DE DADOS ===
Nome: $DB_NAME
Usuário: $DB_USER
Senha: $DB_PASSWORD
Host: localhost
Porta: 5432

=== ACESSOS ===
Webmin: https://$DOMAIN:10000
Aplicação: https://$DOMAIN (ou http se SSL não configurado)

=== COMANDOS ÚTEIS ===
# Ver logs da aplicação
pm2 logs ${PROJECT_NAME}

# Reiniciar aplicação
pm2 restart ${PROJECT_NAME}

# Ver status
pm2 status

# Deploy/atualização
cd $PROJECT_DIR && ./deploy.sh

# Backup do banco
pg_dump -U $DB_USER -h localhost $DB_NAME > backup_\$(date +%Y%m%d_%H%M%S).sql

=== ARQUIVOS IMPORTANTES ===
Configuração: $PROJECT_DIR/.env
PM2: $PROJECT_DIR/ecosystem.config.js
Nginx: /etc/nginx/conf.d/${PROJECT_NAME}.conf
Logs: $PROJECT_DIR/logs/
EOF

# Salvar senha do banco em local seguro
echo "$DB_PASSWORD" > /root/${PROJECT_NAME}_db_password.txt
chmod 600 /root/${PROJECT_NAME}_db_password.txt

log "✅ Instalação base concluída!"
echo
echo -e "${GREEN}=== PRÓXIMOS PASSOS ===${NC}"
echo "1. Faça upload dos arquivos do projeto para: $PROJECT_DIR"
echo "2. Execute: cd $PROJECT_DIR && ./build.sh"
echo "3. Execute: cd $PROJECT_DIR && ./deploy.sh"
echo "4. Acesse Webmin em: https://$DOMAIN:10000"
echo "5. Acesse aplicação em: https://$DOMAIN"
echo
echo -e "${YELLOW}Informações salvas em: $PROJECT_DIR/DEPLOY_INFO.txt${NC}"
echo -e "${YELLOW}Senha do banco salva em: /root/${PROJECT_NAME}_db_password.txt${NC}"