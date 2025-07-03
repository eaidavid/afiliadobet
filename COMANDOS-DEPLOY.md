# 🚀 Comandos de Deploy - AfiliadosBet

## Deploy Automático Completo

### Comando Único (Mais Simples)
```bash
# No seu servidor VPS AlmaLinux como root:
curl -sSL https://raw.githubusercontent.com/eaidavid/afiliadobet/main/deploy/deploy-vps.sh | bash -s afiliadosbet.com.br 5000
```

### Depois do setup automático, clone e deploy:
```bash
# Ainda no servidor:
cd /var/www
git clone https://github.com/eaidavid/afiliadobet.git afiliadosbet_temp
rsync -av --exclude='.git' afiliadosbet_temp/ afiliadosbet/
rm -rf afiliadosbet_temp
cd afiliadosbet
./build.sh
./deploy.sh
```

## Comandos Alternativos

### Opção 1 - Deploy com Script Específico
```bash
# No seu computador:
wget https://raw.githubusercontent.com/eaidavid/afiliadobet/main/deploy/deploy-afiliadosbet.sh
chmod +x deploy-afiliadosbet.sh
bash deploy-afiliadosbet.sh SEU_IP_VPS
```

### Opção 2 - Upload Manual
```bash
# No seu computador:
git clone https://github.com/eaidavid/afiliadobet.git
cd afiliadobet
bash deploy/deploy-vps.sh afiliadosbet.com.br 5000
bash deploy/upload-project.sh SEU_IP_VPS root
```

## Verificação do Deploy

```bash
# No servidor, verificar se tudo está funcionando:
bash /var/www/afiliadosbet/check-system.sh
```

## Acessos Após Deploy

- **Site**: https://afiliadosbet.com.br
- **Webmin**: https://afiliadosbet.com.br:10000
- **Logs**: `pm2 logs afiliadosbet`

## Comandos de Manutenção

```bash
# Reiniciar aplicação
pm2 restart afiliadosbet

# Ver logs em tempo real
pm2 logs afiliadosbet -f

# Atualizar código (após push no GitHub)
cd /var/www/afiliadosbet
git pull origin main
./deploy.sh

# Backup do banco
pg_dump -U afiliadosbet_user -h localhost afiliadosbet_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Troubleshooting Rápido

```bash
# Se algo não funcionar:
systemctl restart nginx postgresql
pm2 restart afiliadosbet
```

---

**Resumo**: Execute o primeiro comando no seu servidor VPS e depois faça o git clone + build. Em 5 minutos seu site estará no ar!