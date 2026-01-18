# 🚨 COMO CORRIGIR DELETE DE USUÁRIOS (3 OPÇÕES)

## ⚡ OPÇÃO 1: Script Automático Completo (RECOMENDADO)

**Use se:** É a primeira vez configurando o servidor OU quer reinstalar tudo.

```bash
ssh root@76.13.69.173
# Senha: @Yur1GDSF.19

cd /var/www/VFS  # ou onde clonou o projeto
bash setup-vps.sh
```

**O script vai:**
- ✅ Instalar Node.js (se necessário)
- ✅ Instalar PM2 (se necessário)
- ✅ Atualizar código do GitHub
- ✅ Instalar dependências
- ✅ Criar .env com SERVICE_ROLE_KEY correto
- ✅ Iniciar servidor com PM2
- ✅ Configurar para iniciar no boot
- ✅ Testar se está funcionando

**Tempo:** ~3-5 minutos

---

## ⚡ OPÇÃO 2: Script Rápido - Apenas .env (MAIS RÁPIDO)

**Use se:** Servidor já está rodando, só precisa corrigir o .env.

```bash
ssh root@76.13.69.173
# Senha: @Yur1GDSF.19

cd /var/www/VFS  # ou onde está o projeto
bash fix-env-only.sh
```

**O script vai:**
- ✅ Fazer backup do .env atual
- ✅ Criar novo .env com SERVICE_ROLE_KEY
- ✅ Reiniciar PM2 automaticamente
- ✅ Mostrar logs para validar

**Tempo:** ~30 segundos

---

## ⚡ OPÇÃO 3: Manual (SE PREFERIR)

### 1. Conectar no servidor:
```bash
ssh root@76.13.69.173
# Senha: @Yur1GDSF.19
```

### 2. Ir para o diretório:
```bash
cd /var/www/VFS
```

### 3. Editar .env:
```bash
nano .env
```

### 4. Colar isso (sobrescrever tudo):
```env
SUPABASE_URL=https://vqhupxtycqmbqgwrxobu.supabase.co
SUPABASE_KEY=sb_publishable_ul5SbScqAVzeE-yVm88bBg_8f3msa0z
SUPABASE_SERVICE_ROLE_KEY=sb_secret_QLqZxI4UJgK1WrHRxH2HPw_tZkyYI2t
DATABASE_URL="postgresql://postgres.vqhupxtycqmbqgwrxobu:saasvdF120229@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.vqhupxtycqmbqgwrxobu:saasvdF120229@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
VITE_SUPABASE_URL=https://vqhupxtycqmbqgwrxobu.supabase.co
VITE_SUPABASE_KEY=sb_publishable_ul5SbScqAVzeE-yVm88bBg_8f3msa0z
PORT=5000
NODE_ENV=production
```

**Salvar:** Ctrl+O → Enter → Ctrl+X

### 5. Reiniciar servidor:
```bash
pm2 restart vfs-backend
# OU se não usa PM2:
# killall node && node server/index.js &
```

### 6. Ver logs:
```bash
pm2 logs vfs-backend --lines 50
```

**Tempo:** ~2 minutos

---

## ✅ COMO SABER SE FUNCIONOU

### 1. Ver logs do delete:

Quando deletar usuário no painel, deve aparecer:

```
[ADMIN DELETE] Starting deletion for user: abc123
[DELETE] Subscriptions deleted successfully
[DELETE] AI logs deleted successfully
[DELETE] Auth user deleted successfully
[DELETE] User found, proceeding with delete: {...}
[DELETE] Public user delete result: [{...}]
[ADMIN DELETE] User abc123 deleted completely - 1 record(s) deleted
```

### 2. Usuário some da lista ✅

### 3. Sem erros no console do navegador ✅

---

## 🆘 SE NÃO FUNCIONAR

### Ver logs completos:
```bash
pm2 logs vfs-backend --lines 100
```

### Testar diagnóstico:
```bash
curl http://localhost:5000/health
```

### Verificar .env:
```bash
cat .env | grep SERVICE_ROLE_KEY
# Deve mostrar: SUPABASE_SERVICE_ROLE_KEY=sb_secret_QLqZxI4UJgK1WrHRxH2HPw_tZkyYI2t
```

### Ainda com problema?
Leia: `SOLUCAO_DELETE.md` (guia completo de troubleshooting)

---

## 📊 RESUMO

| Opção | Tempo | Dificuldade | Recomendado Para |
|-------|-------|-------------|------------------|
| **Script Completo** | 3-5min | Fácil | Primeira vez ou reinstalar |
| **Script Rápido** | 30seg | Muito Fácil | Servidor já rodando |
| **Manual** | 2min | Médio | Se prefere controle total |

---

## 🎯 ESCOLHA SUA OPÇÃO E EXECUTE AGORA!

**Dica:** Use a Opção 2 (Script Rápido) se já tem o servidor rodando. É a mais rápida.
