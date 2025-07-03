#!/bin/bash
# Deploy Específico para AfiliadosBet - afiliadosbet.com.br
# Repositório: https://github.com/eaidavid/afiliadobet
# Execução: bash deploy-afiliadosbet.sh [IP_DO_SERVIDOR]

set -e

SERVER_IP=${1:-""}
DOMAIN="afiliadosbet.com.br"
PORT="5000"
REPO_URL="https://github.com/eaidavid/afiliadobet.git"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deploy AfiliadosBet para ${DOMAIN}${NC}"

if [ -z "$SERVER_IP" ]; then
    echo -e "${RED}❌ Erro: IP do servidor é obrigatório${NC}"
    echo "Uso: bash deploy-afiliadosbet.sh [IP_DO_SERVIDOR]"
    echo "Exemplo: bash deploy-afiliadosbet.sh 192.168.1.100"
    exit 1
fi

echo "📋 Configurações:"
echo "  - Servidor: $SERVER_IP"
echo "  - Domínio: $DOMAIN"
echo "  - Porta: $PORT"
echo "  - Repositório: $REPO_URL"

# 1. Download e execução do script de setup no servidor
echo -e "${YELLOW}📤 Baixando e executando script de setup...${NC}"
ssh root@$SERVER_IP "curl -sSL https://raw.githubusercontent.com/eaidavid/afiliadobet/main/deploy/deploy-vps.sh | bash -s $DOMAIN $PORT"

# 2. Clone do repositório diretamente no servidor
echo -e "${YELLOW}📦 Clonando repositório no servidor...${NC}"
ssh root@$SERVER_IP "
cd /var/www && 
rm -rf afiliadosbet_temp &&
git clone $REPO_URL afiliadosbet_temp &&
rsync -av --exclude='.git' afiliadosbet_temp/ afiliadosbet/ &&
rm -rf afiliadosbet_temp &&
chown -R afiliadosbet:afiliadosbet afiliadosbet
"

# 3. Build e deploy no servidor
echo -e "${YELLOW}🔨 Executando build e deploy...${NC}"
ssh root@$SERVER_IP "
cd /var/www/afiliadosbet &&
./build.sh &&
./deploy.sh
"

# 4. Verificar status
echo -e "${YELLOW}🔍 Verificando status do deploy...${NC}"
ssh root@$SERVER_IP "
systemctl status nginx --no-pager -l &&
pm2 status &&
curl -I http://localhost:$PORT
"

echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo -e "${GREEN}🌐 Acesse: https://$DOMAIN${NC}"
echo -e "${GREEN}⚙️ Webmin: https://$DOMAIN:10000${NC}"
echo
echo -e "${BLUE}📋 Informações importantes:${NC}"
echo "- Configurações: /var/www/afiliadosbet/DEPLOY_INFO.txt"
echo "- Logs: pm2 logs afiliadosbet"
echo "- Reiniciar: pm2 restart afiliadosbet"
echo "- Verificar sistema: bash /var/www/afiliadosbet/check-system.sh"