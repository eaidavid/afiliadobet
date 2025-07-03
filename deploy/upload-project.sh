#!/bin/bash
# Script para upload do projeto AfiliadosBet para VPS
# Execução: bash upload-project.sh [IP_DO_SERVIDOR] [USUARIO]

set -e

SERVER_IP=${1:-""}
SERVER_USER=${2:-"root"}
PROJECT_DIR="/var/www/afiliadosbet"

if [ -z "$SERVER_IP" ]; then
    echo "❌ Erro: IP do servidor é obrigatório"
    echo "Uso: bash upload-project.sh [IP_DO_SERVIDOR] [USUARIO]"
    echo "Exemplo: bash upload-project.sh 192.168.1.100 root"
    exit 1
fi

echo "🚀 Fazendo upload do projeto para $SERVER_USER@$SERVER_IP:$PROJECT_DIR"

# 1. Criar arquivo temporário com exclusões
cat > .deployignore << EOF
node_modules/
.git/
.env.local
.env.development
dist/
logs/
*.log
.DS_Store
.replit
*.sql
deploy/
attached_assets/
EOF

# 2. Fazer upload via rsync
echo "📤 Enviando arquivos..."
rsync -avz \
    --exclude-from=.deployignore \
    --progress \
    ./ $SERVER_USER@$SERVER_IP:$PROJECT_DIR/

# 3. Limpar arquivo temporário
rm .deployignore

echo "✅ Upload concluído!"
echo "Próximos comandos no servidor:"
echo "ssh $SERVER_USER@$SERVER_IP"
echo "cd $PROJECT_DIR && ./build.sh"
echo "cd $PROJECT_DIR && ./deploy.sh"