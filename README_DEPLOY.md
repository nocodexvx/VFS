# 🚀 GUIA DE DEPLOY - VPS

## 📋 PRÉ-REQUISITOS NO SERVIDOR VPS

### 1. Conectar via SSH
```bash
ssh root@76.13.69.173
# Senha: @Yur1GDSF.19
```

### 2. Instalar Node.js 18+ (se não instalado)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
node --version  # Deve mostrar v18 ou superior
```

### 3. Instalar PM2 (gerenciador de processos)
```bash
npm install -g pm2
```

---

## 🔧 CONFIGURAÇÃO DO PROJETO

### 1. Clonar/Atualizar Repositório
```bash
cd /var/www  # ou diretório desejado
git clone https://github.com/nocodexvx/VFS.git
cd VFS
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. **CRÍTICO: Configurar .env no Servidor**
```bash
nano .env
```

Cole o conteúdo (substitua pelos valores reais):
```env
# Supabase Configuration
SUPABASE_URL=https://vqhupxtycqmbqgwrxobu.supabase.co
SUPABASE_KEY=sb_publishable_ul5SbScqAVzeE-yVm88bBg_8f3msa0z
SUPABASE_SERVICE_ROLE_KEY=sb_secret_QLqZxI4UJgK1WrHRxH2HPw_tZkyYI2t

# Database URLs
DATABASE_URL="postgresql://postgres.vqhupxtycqmbqgwrxobu:saasvdF120229@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.vqhupxtycqmbqgwrxobu:saasvdF120229@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"

# Frontend
VITE_SUPABASE_URL=https://vqhupxtycqmbqgwrxobu.supabase.co
VITE_SUPABASE_KEY=sb_publishable_ul5SbScqAVzeE-yVm88bBg_8f3msa0z

# Server
PORT=5000
NODE_ENV=production
```

**Salvar:** Ctrl+O, Enter, Ctrl+X

### 4. Build do Frontend (se necessário)
```bash
npm run build
```

---

## 🚀 INICIAR SERVIDOR

### Opção 1: PM2 (Recomendado - Mantém rodando)
```bash
pm2 start server/index.js --name "vfs-backend"
pm2 save
pm2 startup  # Configura para iniciar no boot
```

### Opção 2: Direto (Para testes)
```bash
node server/index.js
```

---

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

### 1. Testar Backend
```bash
curl http://localhost:5000/health
# Deve retornar: {"status":"ok"}
```

### 2. Verificar Logs
```bash
pm2 logs vfs-backend
```

### 3. Verificar Status
```bash
pm2 status
```

---

## 🔧 COMANDOS ÚTEIS

### Reiniciar Servidor
```bash
pm2 restart vfs-backend
```

### Parar Servidor
```bash
pm2 stop vfs-backend
```

### Ver Logs em Tempo Real
```bash
pm2 logs vfs-backend --lines 100
```

### Atualizar Código
```bash
cd /var/www/VFS
git pull origin main
npm install  # Se houver novas dependências
pm2 restart vfs-backend
```

---

## 🔥 RESOLVER PROBLEMA DE DELETE DE USUÁRIOS

### Verificar se .env está carregado:
```bash
pm2 restart vfs-backend
pm2 logs vfs-backend
```

### Ao tentar deletar usuário, deve aparecer:
```
[ADMIN DELETE] Starting deletion for user: abc123
[DELETE] Subscriptions deleted successfully
[DELETE] AI logs deleted successfully
[DELETE] Auth user deleted successfully
[DELETE] User found, proceeding with delete: {email: '...', id: '...'}
[DELETE] Public user delete result: [{...}]
[ADMIN DELETE] User abc123 deleted completely - 1 record(s) deleted
```

### Se aparecer erro de RLS:
```
[DELETE] DELETE query succeeded but no rows affected!
```

**Solução:** Ir no Supabase Dashboard → Table Editor → users → RLS → Adicionar policy:
```sql
CREATE POLICY "Service role can delete users"
ON users FOR DELETE
TO service_role
USING (true);
```

---

## 🌐 CONFIGURAR NGINX (Proxy Reverso)

### Instalar Nginx
```bash
apt-get install -y nginx
```

### Configurar Site
```bash
nano /etc/nginx/sites-available/vfs
```

Cole:
```nginx
server {
    listen 80;
    server_name variagen.com.br;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/VFS/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

### Ativar Site
```bash
ln -s /etc/nginx/sites-available/vfs /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 🔒 SEGURANÇA

### 1. Firewall
```bash
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

### 2. SSL (Certbot)
```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d variagen.com.br
```

---

## 📊 MONITORAMENTO

### Ver recursos usados
```bash
pm2 monit
```

### Ver uso de CPU/RAM
```bash
htop
```

---

## 🆘 TROUBLESHOOTING

### Backend não inicia
```bash
pm2 logs vfs-backend --err  # Ver erros
cat .env  # Verificar se .env existe
```

### Delete de usuário não funciona
```bash
# Ver logs quando deletar:
pm2 logs vfs-backend --lines 50

# Testar endpoint de diagnóstico:
curl -X POST http://localhost:5000/api/admin/test-delete-capability \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### Porta já em uso
```bash
lsof -ti:5000 | xargs kill -9
pm2 restart vfs-backend
```
