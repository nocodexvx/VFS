# 🚀 SETUP DO ZERO NO SERVIDOR VPS

## Situação: Projeto não existe no servidor

Execute esses comandos **UM POR VEZ** no terminal do servidor:

---

## PASSO 1: Instalar Git (se necessário)

```bash
apt update && apt install -y git
```

---

## PASSO 2: Criar diretório e clonar projeto

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/nocodexvx/VFS.git
cd VFS
```

---

## PASSO 3: Verificar se branch existe

```bash
git branch -a
git checkout claude/complete-detailed-analysis-4PngS
```

---

## PASSO 4: Instalar Node.js 18+ (se necessário)

```bash
# Verificar se Node.js está instalado
node -v

# Se não estiver ou for versão antiga:
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Verificar novamente
node -v
```

---

## PASSO 5: Instalar dependências do projeto

```bash
npm install
```

---

## PASSO 6: Criar arquivo .env

```bash
cat > .env << 'EOL'
SUPABASE_URL=https://vqhupxtycqmbqgwrxobu.supabase.co
SUPABASE_KEY=sb_publishable_ul5SbScqAVzeE-yVm88bBg_8f3msa0z
SUPABASE_SERVICE_ROLE_KEY=sb_secret_QLqZxI4UJgK1WrHRxH2HPw_tZkyYI2t
DATABASE_URL="postgresql://postgres.vqhupxtycqmbqgwrxobu:saasvdF120229@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.vqhupxtycqmbqgwrxobu:saasvdF120229@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
VITE_SUPABASE_URL=https://vqhupxtycqmbqgwrxobu.supabase.co
VITE_SUPABASE_KEY=sb_publishable_ul5SbScqAVzeE-yVm88bBg_8f3msa0z
PORT=5000
NODE_ENV=production
EOL
```

---

## PASSO 7: Verificar se .env foi criado

```bash
cat .env
```

Deve mostrar todas as variáveis.

---

## PASSO 8: Instalar PM2

```bash
npm install -g pm2
```

---

## PASSO 9: Iniciar servidor

```bash
pm2 start server/index.js --name vfs-backend
pm2 save
pm2 startup
```

---

## PASSO 10: Verificar se está rodando

```bash
pm2 status
pm2 logs vfs-backend --lines 20
```

---

## PASSO 11: Testar backend

```bash
curl http://localhost:5000/health
```

Deve retornar: `{"status":"ok"}` ou similar

---

## ✅ PRONTO!

Agora teste deletar um usuário no painel admin.

---

## 🔍 Ver logs em tempo real

```bash
pm2 logs vfs-backend
```

Pressione `Ctrl+C` para sair dos logs.

---

## 🔄 Comandos úteis

**Reiniciar servidor:**
```bash
pm2 restart vfs-backend
```

**Parar servidor:**
```bash
pm2 stop vfs-backend
```

**Ver status:**
```bash
pm2 status
```

**Ver logs dos últimos deletes:**
```bash
pm2 logs vfs-backend --lines 100 | grep DELETE
```
