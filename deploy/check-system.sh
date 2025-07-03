#!/bin/bash
# Script de Verificação do Sistema AfiliadosBet
# Execução: bash check-system.sh

echo "🔍 Verificando sistema AfiliadosBet..."

PROJECT_DIR="/var/www/afiliadosbet"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check() {
    if [ $? -eq 0 ]; then
        echo -e "  ${GREEN}✅ $1${NC}"
    else
        echo -e "  ${RED}❌ $1${NC}"
    fi
}

# 1. Verificar serviços do sistema
echo "📋 Serviços do Sistema:"
systemctl is-active --quiet nginx && echo -e "  ${GREEN}✅ Nginx ativo${NC}" || echo -e "  ${RED}❌ Nginx inativo${NC}"
systemctl is-active --quiet postgresql && echo -e "  ${GREEN}✅ PostgreSQL ativo${NC}" || echo -e "  ${RED}❌ PostgreSQL inativo${NC}"
systemctl is-active --quiet webmin && echo -e "  ${GREEN}✅ Webmin ativo${NC}" || echo -e "  ${RED}❌ Webmin inativo${NC}"
systemctl is-active --quiet firewalld && echo -e "  ${GREEN}✅ Firewall ativo${NC}" || echo -e "  ${RED}❌ Firewall inativo${NC}"

# 2. Verificar PM2
echo -e "\n🔄 PM2 e Aplicação:"
if command -v pm2 &> /dev/null; then
    echo -e "  ${GREEN}✅ PM2 instalado${NC}"
    pm2_status=$(pm2 list | grep afiliadosbet | awk '{print $10}')
    if [ "$pm2_status" = "online" ]; then
        echo -e "  ${GREEN}✅ AfiliadosBet online${NC}"
    else
        echo -e "  ${RED}❌ AfiliadosBet offline${NC}"
    fi
else
    echo -e "  ${RED}❌ PM2 não instalado${NC}"
fi

# 3. Verificar Node.js
echo -e "\n🟢 Node.js:"
if command -v node &> /dev/null; then
    node_version=$(node -v)
    echo -e "  ${GREEN}✅ Node.js $node_version${NC}"
else
    echo -e "  ${RED}❌ Node.js não instalado${NC}"
fi

# 4. Verificar banco de dados
echo -e "\n🗄️ Banco de Dados:"
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw afiliadosbet_db; then
    echo -e "  ${GREEN}✅ Banco afiliadosbet_db existe${NC}"
else
    echo -e "  ${RED}❌ Banco afiliadosbet_db não encontrado${NC}"
fi

# 5. Verificar arquivos do projeto
echo -e "\n📁 Arquivos do Projeto:"
[ -d "$PROJECT_DIR" ] && echo -e "  ${GREEN}✅ Diretório do projeto${NC}" || echo -e "  ${RED}❌ Diretório não encontrado${NC}"
[ -f "$PROJECT_DIR/package.json" ] && echo -e "  ${GREEN}✅ package.json${NC}" || echo -e "  ${RED}❌ package.json não encontrado${NC}"
[ -f "$PROJECT_DIR/.env" ] && echo -e "  ${GREEN}✅ .env configurado${NC}" || echo -e "  ${RED}❌ .env não encontrado${NC}"
[ -f "$PROJECT_DIR/ecosystem.config.js" ] && echo -e "  ${GREEN}✅ PM2 config${NC}" || echo -e "  ${RED}❌ PM2 config não encontrado${NC}"

# 6. Verificar portas
echo -e "\n🌐 Conectividade:"
if curl -s http://localhost:5000 > /dev/null; then
    echo -e "  ${GREEN}✅ Aplicação responde na porta 5000${NC}"
else
    echo -e "  ${RED}❌ Aplicação não responde na porta 5000${NC}"
fi

if ss -tuln | grep -q ":80 "; then
    echo -e "  ${GREEN}✅ Nginx na porta 80${NC}"
else
    echo -e "  ${RED}❌ Nginx não está na porta 80${NC}"
fi

if ss -tuln | grep -q ":10000 "; then
    echo -e "  ${GREEN}✅ Webmin na porta 10000${NC}"
else
    echo -e "  ${RED}❌ Webmin não está na porta 10000${NC}"
fi

# 7. Uso de recursos
echo -e "\n💾 Recursos do Sistema:"
memory_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
echo "  🧠 Memória: ${memory_usage}%"

disk_usage=$(df -h / | awk 'NR==2{print $5}' | sed 's/%//')
echo "  💽 Disco: ${disk_usage}%"

load_avg=$(uptime | awk -F'load average:' '{print $2}')
echo "  ⚡ Load:$load_avg"

# 8. Logs recentes
echo -e "\n📝 Status dos Logs:"
if [ -d "$PROJECT_DIR/logs" ]; then
    echo -e "  ${GREEN}✅ Diretório de logs existe${NC}"
    log_files=$(ls -la $PROJECT_DIR/logs/ 2>/dev/null | wc -l)
    echo "  📊 Arquivos de log: $log_files"
else
    echo -e "  ${RED}❌ Diretório de logs não encontrado${NC}"
fi

# 9. Certificados SSL
echo -e "\n🔒 SSL/HTTPS:"
if [ -d "/etc/letsencrypt/live" ] && [ "$(ls -A /etc/letsencrypt/live)" ]; then
    echo -e "  ${GREEN}✅ Certificados SSL encontrados${NC}"
else
    echo -e "  ${YELLOW}⚠️ Nenhum certificado SSL encontrado${NC}"
fi

echo -e "\n📊 Resumo do Sistema:"
echo "════════════════════════════════════"

# Comandos úteis
echo -e "\n🔧 Comandos Úteis:"
echo "Ver logs: pm2 logs afiliadosbet"
echo "Reiniciar: pm2 restart afiliadosbet"
echo "Status: pm2 status"
echo "Monitorar: pm2 monit"
echo "Deploy: cd $PROJECT_DIR && ./deploy.sh"