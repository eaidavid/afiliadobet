#!/bin/bash
# Deploy em Uma Linha - AfiliadosBet
# Uso: bash quick-deploy.sh [IP_SERVIDOR] [DOMINIO] [PORTA]

SERVER_IP=${1:-""}
DOMAIN=${2:-"localhost"}
PORT=${3:-5000}

if [ -z "$SERVER_IP" ]; then
    echo "❌ Uso: bash quick-deploy.sh [IP_SERVIDOR] [DOMINIO] [PORTA]"
    echo "Exemplo: bash quick-deploy.sh 192.168.1.100 meusite.com 5000"
    exit 1
fi

echo "🚀 Deploy rápido para $SERVER_IP com domínio $DOMAIN na porta $PORT"

# 1. Upload do script de instalação
echo "📤 Enviando script de instalação..."
scp deploy/deploy-vps.sh root@$SERVER_IP:/root/

# 2. Executar instalação no servidor
echo "⚙️ Executando instalação no servidor..."
ssh root@$SERVER_IP "bash /root/deploy-vps.sh $DOMAIN $PORT"

# 3. Upload do projeto
echo "📦 Enviando projeto..."
bash deploy/upload-project.sh $SERVER_IP root

# 4. Build e deploy
echo "🔨 Fazendo build e deploy..."
ssh root@$SERVER_IP "cd /var/www/afiliadosbet && ./build.sh && ./deploy.sh"

echo "✅ Deploy concluído!"
echo "🌐 Acesse: http://$DOMAIN (ou http://$SERVER_IP)"
echo "⚙️ Webmin: https://$DOMAIN:10000 (ou https://$SERVER_IP:10000)"