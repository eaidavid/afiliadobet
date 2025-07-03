# 🔥 SUPER DEPLOY - Comando TOP para AfiliadosBet

## ⚡ Deploy em UMA LINHA - Faz TUDO Automaticamente

```bash
bash <(curl -sSL https://raw.githubusercontent.com/eaidavid/afiliadobet/main/deploy/super-deploy.sh) SEU_IP_VPS
```

**Exemplo:**
```bash
bash <(curl -sSL https://raw.githubusercontent.com/eaidavid/afiliadobet/main/deploy/super-deploy.sh) 192.168.1.100
```

## 🎯 O que este comando faz em 5 minutos:

### 🔧 **Configuração Completa do Servidor**
- ✅ Atualiza AlmaLinux
- ✅ Instala Node.js 20, PostgreSQL, Nginx, PM2, Webmin
- ✅ Configura firewall automaticamente

### 🗄️ **Banco de Dados**
- ✅ Configura PostgreSQL
- ✅ Cria banco `afiliadosbet_db`
- ✅ Cria usuário com senha segura
- ✅ Configura permissões

### 📦 **Deploy da Aplicação**
- ✅ Clona repositório: `https://github.com/eaidavid/afiliadobet.git`
- ✅ Instala dependências
- ✅ Faz build de produção
- ✅ Executa migrações do banco
- ✅ Configura variáveis de ambiente

### 🌐 **Servidor Web**
- ✅ Configura Nginx com proxy reverso
- ✅ Configura SSL/HTTPS para `afiliadosbet.com.br`
- ✅ Otimizações de performance (gzip, cache)

### 🔄 **Gerenciamento de Processo**
- ✅ Configura PM2 com cluster
- ✅ Auto-restart em caso de falha
- ✅ Logs estruturados

### ⚙️ **Painel de Administração**
- ✅ Instala e configura Webmin
- ✅ Acesso via porta 10000

### 🛠️ **Scripts de Manutenção**
- ✅ `update.sh` - Atualizar aplicação
- ✅ `backup.sh` - Backup automático
- ✅ `status.sh` - Verificar sistema

## 🌐 Acessos Após Deploy

- **Site Principal**: https://afiliadosbet.com.br
- **Painel Webmin**: https://afiliadosbet.com.br:10000

## 📱 Comandos de Manutenção

```bash
# Conectar ao servidor
ssh root@SEU_IP

# Ver status do sistema
cd /var/www/afiliadosbet && ./status.sh

# Ver logs da aplicação
pm2 logs afiliadosbet

# Atualizar aplicação (após push no GitHub)
cd /var/www/afiliadosbet && ./update.sh

# Fazer backup
cd /var/www/afiliadosbet && ./backup.sh

# Reiniciar aplicação
pm2 restart afiliadosbet
```

## ⚡ Por que este comando é TOP?

1. **Zero Configuração Manual** - Tudo automático
2. **Deploy em 5 Minutos** - Do zero ao ar
3. **Pronto para Produção** - SSL, firewall, otimizações
4. **Monitoramento Incluso** - Logs, status, backup
5. **Manutenção Simples** - Scripts prontos
6. **Totalmente Testado** - Verificação automática

## 🔒 Segurança Incluída

- ✅ Firewall configurado (apenas portas necessárias)
- ✅ SSL/HTTPS automático via Let's Encrypt
- ✅ Senhas de banco geradas automaticamente
- ✅ Usuário de sistema dedicado
- ✅ Permissões de arquivo corretas

## 📊 Monitoramento Automático

O script verifica automaticamente:
- Status dos serviços (Nginx, PostgreSQL, PM2)
- Conectividade da aplicação
- Recursos do sistema (memória, disco)
- Logs de erro

## 🚨 Em Caso de Problemas

Se algo der errado, o script mostra exatamente onde parou e você pode:

1. **Ver logs detalhados**:
   ```bash
   ssh root@SEU_IP
   pm2 logs afiliadosbet
   ```

2. **Verificar status**:
   ```bash
   cd /var/www/afiliadosbet && ./status.sh
   ```

3. **Executar novamente** - O script é idempotente (pode rodar várias vezes)

---

## 🎉 Resultado Final

Após executar o comando, você terá:

- ✅ **AfiliadosBet rodando em produção**
- ✅ **HTTPS configurado automaticamente**
- ✅ **Banco PostgreSQL funcionando**
- ✅ **Painel Webmin acessível**
- ✅ **Scripts de manutenção prontos**
- ✅ **Sistema monitorado e otimizado**

**Seu sistema de afiliados estará 100% operacional em menos de 5 minutos!**