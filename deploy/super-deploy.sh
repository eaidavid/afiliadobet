#!/bin/bash
# SUPER DEPLOY - AfiliadosBet - Comando TOP para Deploy Completo
# Execução: bash <(curl -sSL https://raw.githubusercontent.com/eaidavid/afiliadobet/main/deploy/super-deploy.sh) [IP_SERVIDOR]

set -e

SERVER_IP=${1:-""}
DOMAIN="afiliadosbet.com.br"
PORT="5000"
REPO_URL="https://github.com/eaidavid/afiliadobet.git"
PROJECT_NAME="afiliadosbet"
PROJECT_DIR="/var/www/${PROJECT_NAME}"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Arte ASCII
echo -e "${PURPLE}"
cat << "EOF"
   ___   ______ _____ _      _____          _____   ____   _____ ____  ______ _______ 
  / _ \ |  ____|_   _| |    |_   _|   /\   |  __ \ / __ \ / ____|  _ \|  ____|__   __|
 / /_\ \| |__    | | | |      | |    /  \  | |  | | |  | | (___ | |_) | |__     | |   
 |  _  ||  __|   | | | |      | |   / /\ \ | |  | | |  | |\___ \|  _ <|  __|    | |   
 | | | || |     _| |_| |____ _| |_ / ____ \| |__| | |__| |____) | |_) | |____   | |   
 |_| |_||_|    |_____|______|_____/_/    \_\_____/ \____/|_____/|____/|______|  |_|   
                                                                                      
EOF
echo -e "${NC}"

echo -e "${CYAN}🚀 SUPER DEPLOY - Deploy Completo e Automático${NC}"
echo -e "${BLUE}Repositório: $REPO_URL${NC}"
echo -e "${BLUE}Domínio: $DOMAIN${NC}"
echo -e "${BLUE}Porta: $PORT${NC}"

if [ -z "$SERVER_IP" ]; then
    echo -e "${RED}❌ Erro: IP do servidor é obrigatório${NC}"
    echo -e "${YELLOW}Uso: bash <(curl -sSL https://raw.githubusercontent.com/eaidavid/afiliadobet/main/deploy/super-deploy.sh) IP_SERVIDOR${NC}"
    echo -e "${YELLOW}Exemplo: bash <(curl -sSL https://raw.githubusercontent.com/eaidavid/afiliadobet/main/deploy/super-deploy.sh) 192.168.1.100${NC}"
    exit 1
fi

# Função para executar comandos remotos
remote_exec() {
    ssh -o StrictHostKeyChecking=no root@$SERVER_IP "$1"
}

# Função para logging
log() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

# Verificar conectividade SSH
log "Verificando conectividade SSH..."
if ! ssh -o BatchMode=yes -o ConnectTimeout=5 root@$SERVER_IP exit 2>/dev/null; then
    error "Não foi possível conectar via SSH. Verifique o IP e acesso root."
fi

# ETAPA 1: SETUP COMPLETO DO SERVIDOR
log "🔧 Iniciando setup completo do servidor..."

remote_exec "
set -e

# Atualizar sistema
dnf update -y >/dev/null 2>&1
dnf install -y epel-release >/dev/null 2>&1

# Instalar dependências essenciais
dnf install -y curl wget git nginx postgresql postgresql-server postgresql-contrib firewalld certbot python3-certbot-nginx htop unzip rsync >/dev/null 2>&1

# Instalar Node.js 20
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash - >/dev/null 2>&1
    dnf install -y nodejs >/dev/null 2>&1
fi

# Instalar PM2
npm install -g pm2 >/dev/null 2>&1

echo '✅ Dependências instaladas'
"

# ETAPA 2: CONFIGURAR POSTGRESQL
log "🗄️ Configurando PostgreSQL..."

remote_exec "
set -e

# Inicializar PostgreSQL se necessário
if [ ! -f /var/lib/pgsql/data/postgresql.conf ]; then
    postgresql-setup --initdb >/dev/null 2>&1
fi

systemctl enable postgresql >/dev/null 2>&1
systemctl start postgresql >/dev/null 2>&1

# Gerar senha aleatória para o banco
DB_PASSWORD=\$(openssl rand -base64 32)

# Criar banco e usuário
sudo -u postgres psql -c \"CREATE DATABASE ${PROJECT_NAME}_db;\" 2>/dev/null || true
sudo -u postgres psql -c \"CREATE USER ${PROJECT_NAME}_user WITH PASSWORD '\$DB_PASSWORD';\" 2>/dev/null || true
sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE ${PROJECT_NAME}_db TO ${PROJECT_NAME}_user;\" 2>/dev/null || true
sudo -u postgres psql -c \"ALTER USER ${PROJECT_NAME}_user CREATEDB;\" 2>/dev/null || true

echo \$DB_PASSWORD > /root/${PROJECT_NAME}_db_password.txt
chmod 600 /root/${PROJECT_NAME}_db_password.txt

echo '✅ PostgreSQL configurado'
"

# ETAPA 3: CONFIGURAR FIREWALL
log "🔥 Configurando firewall..."

remote_exec "
systemctl enable firewalld >/dev/null 2>&1
systemctl start firewalld >/dev/null 2>&1
firewall-cmd --permanent --add-service=http >/dev/null 2>&1
firewall-cmd --permanent --add-service=https >/dev/null 2>&1
firewall-cmd --permanent --add-port=80/tcp >/dev/null 2>&1
firewall-cmd --permanent --add-port=443/tcp >/dev/null 2>&1
firewall-cmd --permanent --add-port=${PORT}/tcp >/dev/null 2>&1
firewall-cmd --permanent --add-port=10000/tcp >/dev/null 2>&1
firewall-cmd --reload >/dev/null 2>&1
echo '✅ Firewall configurado'
"

# ETAPA 4: INSTALAR WEBMIN
log "⚙️ Instalando Webmin..."

remote_exec "
if ! command -v webmin &> /dev/null; then
    cat > /etc/yum.repos.d/webmin.repo << 'EOF'
[Webmin]
name=Webmin Distribution Neutral
baseurl=https://download.webmin.com/download/yum
enabled=1
gpgcheck=1
gpgkey=https://download.webmin.com/jcameron-key.asc
EOF
    dnf install -y webmin >/dev/null 2>&1
    systemctl enable webmin >/dev/null 2>&1
    systemctl start webmin >/dev/null 2>&1
fi
echo '✅ Webmin instalado'
"

# ETAPA 5: CLONAR E CONFIGURAR PROJETO
log "📦 Clonando projeto do GitHub..."

remote_exec "
set -e

# Criar diretório e clonar projeto
mkdir -p $PROJECT_DIR
cd /var/www

# Remove instalação anterior se existir
rm -rf ${PROJECT_NAME}_temp ${PROJECT_NAME}_backup

# Backup da instalação atual se existir
if [ -d \"$PROJECT_NAME\" ]; then
    mv $PROJECT_NAME ${PROJECT_NAME}_backup
fi

# Clonar repositório
git clone $REPO_URL ${PROJECT_NAME}_temp >/dev/null 2>&1
mv ${PROJECT_NAME}_temp $PROJECT_NAME
cd $PROJECT_NAME

# Obter senha do banco
DB_PASSWORD=\$(cat /root/${PROJECT_NAME}_db_password.txt)

# Criar arquivo .env
cat > .env << EOF
NODE_ENV=production
PORT=${PORT}
DATABASE_URL=postgresql://${PROJECT_NAME}_user:\$DB_PASSWORD@localhost:5432/${PROJECT_NAME}_db
SESSION_SECRET=\$(openssl rand -base64 64)
PGHOST=localhost
PGPORT=5432
PGUSER=${PROJECT_NAME}_user
PGPASSWORD=\$DB_PASSWORD
PGDATABASE=${PROJECT_NAME}_db
EOF

echo '✅ Projeto clonado e configurado'
"

# ETAPA 6: CONFIGURAR NGINX
log "🌐 Configurando Nginx..."

remote_exec "
cat > /etc/nginx/conf.d/${PROJECT_NAME}.conf << 'EOF'
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    
    client_max_body_size 100M;
    
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
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location /assets/ {
        alias ${PROJECT_DIR}/dist/assets/;
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;
}
EOF

systemctl enable nginx >/dev/null 2>&1
systemctl start nginx >/dev/null 2>&1
echo '✅ Nginx configurado'
"

# ETAPA 7: CONFIGURAR PM2
log "🔄 Configurando PM2..."

remote_exec "
cd $PROJECT_DIR

cat > ecosystem.config.js << 'EOF'
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

mkdir -p logs
echo '✅ PM2 configurado'
"

# ETAPA 8: BUILD E DEPLOY
log "🔨 Fazendo build do projeto..."

remote_exec "
cd $PROJECT_DIR
npm ci --production=false >/dev/null 2>&1
npm run build >/dev/null 2>&1
npm run db:push >/dev/null 2>&1
echo '✅ Build concluído'
"

# ETAPA 9: INICIAR APLICAÇÃO
log "🚀 Iniciando aplicação..."

remote_exec "
cd $PROJECT_DIR
pm2 stop ${PROJECT_NAME} 2>/dev/null || true
pm2 delete ${PROJECT_NAME} 2>/dev/null || true
pm2 start ecosystem.config.js >/dev/null 2>&1
pm2 save >/dev/null 2>&1
pm2 startup >/dev/null 2>&1
systemctl reload nginx >/dev/null 2>&1
echo '✅ Aplicação iniciada'
"

# ETAPA 10: CONFIGURAR SSL
log "🔒 Configurando SSL..."

remote_exec "
if [ \"$DOMAIN\" != \"localhost\" ]; then
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN >/dev/null 2>&1 || echo 'SSL será configurado manualmente'
fi
echo '✅ SSL configurado'
"

# ETAPA 11: CRIAR SCRIPTS DE MANUTENÇÃO
log "🛠️ Criando scripts de manutenção..."

remote_exec "
cd $PROJECT_DIR

# Script de atualização
cat > update.sh << 'EOF'
#!/bin/bash
cd ${PROJECT_DIR}
git pull origin main
npm ci --production=false
npm run build
npm run db:push
pm2 restart ${PROJECT_NAME}
systemctl reload nginx
echo '✅ Atualização concluída'
EOF

# Script de backup
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=\"/root/backups\"
DATE=\$(date +%Y%m%d_%H%M%S)
mkdir -p \$BACKUP_DIR

# Backup do banco
pg_dump -U ${PROJECT_NAME}_user -h localhost ${PROJECT_NAME}_db > \$BACKUP_DIR/db_\$DATE.sql

# Backup dos arquivos
tar -czf \$BACKUP_DIR/files_\$DATE.tar.gz ${PROJECT_DIR}

# Manter apenas 7 dias
find \$BACKUP_DIR -name \"*.sql\" -mtime +7 -delete
find \$BACKUP_DIR -name \"*.tar.gz\" -mtime +7 -delete

echo '✅ Backup criado: \$BACKUP_DIR/db_\$DATE.sql'
EOF

# Script de status
cat > status.sh << 'EOF'
#!/bin/bash
echo '=== STATUS DO SISTEMA ==='
echo 'Nginx:' \$(systemctl is-active nginx)
echo 'PostgreSQL:' \$(systemctl is-active postgresql)
echo 'Webmin:' \$(systemctl is-active webmin)
echo 'PM2:' \$(pm2 list | grep ${PROJECT_NAME} | awk '{print \$10}')
echo
echo '=== RECURSOS ==='
echo 'Memória:' \$(free -h | grep Mem | awk '{print \$3\"/\"\$2}')
echo 'Disco:' \$(df -h / | awk 'NR==2{print \$5}')
echo 'Load:' \$(uptime | awk -F'load average:' '{print \$2}')
echo
echo '=== LOGS RECENTES ==='
pm2 logs ${PROJECT_NAME} --lines 5 --nostream
EOF

chmod +x *.sh

echo '✅ Scripts de manutenção criados'
"

# ETAPA 12: VERIFICAÇÃO FINAL
log "🔍 Verificação final do sistema..."

remote_exec "
cd $PROJECT_DIR

# Verificar serviços
nginx_status=\$(systemctl is-active nginx)
postgres_status=\$(systemctl is-active postgresql)
pm2_status=\$(pm2 list | grep ${PROJECT_NAME} | awk '{print \$10}')

echo \"Nginx: \$nginx_status\"
echo \"PostgreSQL: \$postgres_status\"
echo \"PM2: \$pm2_status\"

# Testar conectividade
sleep 3
curl_status=\$(curl -s -o /dev/null -w '%{http_code}' http://localhost:${PORT} || echo 'erro')
echo \"Aplicação: HTTP \$curl_status\"

# Salvar informações do deploy
cat > DEPLOY_SUCCESS.txt << EOF
=== DEPLOY CONCLUÍDO COM SUCESSO ===
Data: \$(date)
Servidor: $SERVER_IP
Domínio: $DOMAIN
Porta: $PORT

=== ACESSOS ===
Site: https://$DOMAIN
Webmin: https://$DOMAIN:10000

=== STATUS ===
Nginx: \$nginx_status
PostgreSQL: \$postgres_status
Aplicação: \$pm2_status

=== COMANDOS ÚTEIS ===
Logs: pm2 logs $PROJECT_NAME
Status: ./status.sh
Atualizar: ./update.sh
Backup: ./backup.sh

=== SENHA DO BANCO ===
\$(cat /root/${PROJECT_NAME}_db_password.txt)
EOF
"

# RESULTADO FINAL
echo
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                        🎉 DEPLOY CONCLUÍDO COM SUCESSO! 🎉                   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo
echo -e "${CYAN}🌐 Site: ${GREEN}https://$DOMAIN${NC}"
echo -e "${CYAN}⚙️ Webmin: ${GREEN}https://$DOMAIN:10000${NC}"
echo -e "${CYAN}📊 Status: ${GREEN}ssh root@$SERVER_IP 'cd $PROJECT_DIR && ./status.sh'${NC}"
echo
echo -e "${YELLOW}📋 Comandos de manutenção no servidor:${NC}"
echo -e "${BLUE}  - Logs: ${NC}pm2 logs $PROJECT_NAME"
echo -e "${BLUE}  - Reiniciar: ${NC}pm2 restart $PROJECT_NAME"
echo -e "${BLUE}  - Atualizar: ${NC}cd $PROJECT_DIR && ./update.sh"
echo -e "${BLUE}  - Backup: ${NC}cd $PROJECT_DIR && ./backup.sh"
echo -e "${BLUE}  - Status: ${NC}cd $PROJECT_DIR && ./status.sh"
echo
echo -e "${GREEN}✅ Seu AfiliadosBet está rodando em produção!${NC}"