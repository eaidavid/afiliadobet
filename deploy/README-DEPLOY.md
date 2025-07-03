# Guia de Deploy - AfiliadosBet VPS AlmaLinux + Webmin

## 🚀 Deploy Rápido e Sem Erros

### Pré-requisitos
- VPS com AlmaLinux 8/9
- Acesso root via SSH
- Domínio apontado para o IP do servidor (opcional)

### 1. Comandos Básicos de Deploy

#### No seu computador local:
```bash
# Tornar o script executável
chmod +x deploy/deploy-vps.sh
chmod +x deploy/upload-project.sh

# Fazer upload do script para o servidor
scp deploy/deploy-vps.sh root@SEU_IP:/root/

# Acessar o servidor
ssh root@SEU_IP
```

#### No servidor VPS:
```bash
# Executar instalação completa
bash /root/deploy-vps.sh SEU_DOMINIO.COM 5000

# Se for apenas IP (sem domínio)
bash /root/deploy-vps.sh localhost 5000
```

### 2. Upload do Projeto

#### Opção A - Via rsync (recomendado):
```bash
# No seu computador local
bash deploy/upload-project.sh SEU_IP root
```

#### Opção B - Via SCP manual:
```bash
# Criar arquivo temporário zip
tar -czf afiliadosbet.tar.gz --exclude=node_modules --exclude=.git --exclude=dist .

# Enviar para servidor
scp afiliadosbet.tar.gz root@SEU_IP:/var/www/afiliadosbet/

# No servidor, extrair
ssh root@SEU_IP
cd /var/www/afiliadosbet
tar -xzf afiliadosbet.tar.gz
rm afiliadosbet.tar.gz
```

### 3. Build e Deploy

```bash
# No servidor VPS
cd /var/www/afiliadosbet

# Build inicial
./build.sh

# Deploy da aplicação
./deploy.sh
```

### 4. Verificação do Deploy

```bash
# Ver status dos serviços
systemctl status nginx
systemctl status postgresql
pm2 status

# Ver logs da aplicação
pm2 logs afiliadosbet

# Testar conectividade
curl http://localhost:5000
```

### 5. Acessos Importantes

- **Aplicação**: `http://SEU_DOMINIO` ou `http://SEU_IP`
- **Webmin**: `https://SEU_DOMINIO:10000` ou `https://SEU_IP:10000`
- **Logs**: `/var/www/afiliadosbet/logs/`

### 6. Comandos de Manutenção

```bash
# Reiniciar aplicação
pm2 restart afiliadosbet

# Ver logs em tempo real
pm2 logs afiliadosbet --lines 100 -f

# Backup do banco
pg_dump -U afiliadosbet_user -h localhost afiliadosbet_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Atualizar projeto (após mudanças)
cd /var/www/afiliadosbet
./deploy.sh
```

### 7. Troubleshooting

#### Problema: Aplicação não inicia
```bash
# Verificar logs
pm2 logs afiliadosbet

# Verificar configuração
cat /var/www/afiliadosbet/.env

# Reiniciar serviços
systemctl restart nginx postgresql
pm2 restart afiliadosbet
```

#### Problema: Banco não conecta
```bash
# Verificar status PostgreSQL
systemctl status postgresql

# Testar conexão
psql -U afiliadosbet_user -h localhost afiliadosbet_db

# Ver senha do banco
cat /root/afiliadosbet_db_password.txt
```

#### Problema: Nginx não serve
```bash
# Verificar configuração
nginx -t

# Ver logs do Nginx
tail -f /var/log/nginx/error.log

# Reiniciar Nginx
systemctl restart nginx
```

### 8. Configurações de Produção

#### Backup Automático (opcional):
```bash
# Criar script de backup
cat > /root/backup-afiliadosbet.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup do banco
pg_dump -U afiliadosbet_user -h localhost afiliadosbet_db > $BACKUP_DIR/db_$DATE.sql

# Backup dos arquivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/afiliadosbet

# Manter apenas 7 dias de backup
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /root/backup-afiliadosbet.sh

# Agendar backup diário (crontab)
echo "0 2 * * * /root/backup-afiliadosbet.sh" | crontab -
```

#### Monitoramento:
```bash
# Instalar htop para monitoramento
dnf install -y htop

# Ver uso de recursos
htop

# Ver status completo
pm2 monit
```

### 9. Informações Importantes

Após o deploy, todas as informações importantes estarão em:
- **Configurações**: `/var/www/afiliadosbet/DEPLOY_INFO.txt`
- **Senha do banco**: `/root/afiliadosbet_db_password.txt`
- **Logs da aplicação**: `/var/www/afiliadosbet/logs/`

### 10. Comandos de Uma Linha

```bash
# Deploy completo em um comando
curl -sSL https://raw.githubusercontent.com/[SEU_REPO]/main/deploy/deploy-vps.sh | bash -s SEU_DOMINIO.COM 5000

# Ou se você já tem o arquivo
bash deploy/deploy-vps.sh SEU_DOMINIO.COM 5000 && \
bash deploy/upload-project.sh SEU_IP root && \
ssh root@SEU_IP "cd /var/www/afiliadosbet && ./build.sh && ./deploy.sh"
```

### 🎯 Resumo Rápido

1. **No servidor**: `bash deploy-vps.sh SEU_DOMINIO 5000`
2. **Upload**: `bash upload-project.sh SEU_IP root`
3. **Build**: `ssh root@SEU_IP "cd /var/www/afiliadosbet && ./build.sh"`
4. **Deploy**: `ssh root@SEU_IP "cd /var/www/afiliadosbet && ./deploy.sh"`
5. **Acessar**: `http://SEU_DOMINIO` ou `http://SEU_IP`

✅ **Pronto! Seu AfiliadosBet está rodando na VPS.**