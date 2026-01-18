#!/bin/bash

# ============================================
# SCRIPT RÁPIDO - APENAS CORRIGE .env
# Use este se o servidor já está rodando
# ============================================

set -e

echo "=================================="
echo "🔧 Fix Rápido - Apenas .env"
echo "=================================="
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Ir para diretório do projeto
cd /var/www/VFS || cd ~/VFS || cd /root/VFS || {
    echo -e "${RED}❌ Diretório do projeto não encontrado${NC}"
    echo "Informe o caminho completo:"
    read -r PROJECT_PATH
    cd "$PROJECT_PATH"
}

echo -e "${GREEN}✅ Diretório encontrado: $(pwd)${NC}"
echo ""

# Backup do .env atual se existir
if [ -f ".env" ]; then
    echo "💾 Fazendo backup do .env atual..."
    cp .env .env.backup.$(date +%Y%m%d-%H%M%S)
    echo -e "${GREEN}✅ Backup criado${NC}"
fi

# Criar novo .env
echo "📝 Criando novo .env com SERVICE_ROLE_KEY..."
cat > .env << 'EOL'
# Supabase Configuration
SUPABASE_URL=https://vqhupxtycqmbqgwrxobu.supabase.co
SUPABASE_KEY=sb_publishable_ul5SbScqAVzeE-yVm88bBg_8f3msa0z
SUPABASE_SERVICE_ROLE_KEY=sb_secret_QLqZxI4UJgK1WrHRxH2HPw_tZkyYI2t

# Database URLs
DATABASE_URL="postgresql://postgres.vqhupxtycqmbqgwrxobu:saasvdF120229@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.vqhupxtycqmbqgwrxobu:saasvdF120229@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"

# Frontend (Vite)
VITE_SUPABASE_URL=https://vqhupxtycqmbqgwrxobu.supabase.co
VITE_SUPABASE_KEY=sb_publishable_ul5SbScqAVzeE-yVm88bBg_8f3msa0z

# Server Configuration
PORT=5000
NODE_ENV=production
EOL

echo -e "${GREEN}✅ .env criado com sucesso${NC}"
echo ""

# Verificar conteúdo
echo "🔍 Verificando SUPABASE_SERVICE_ROLE_KEY..."
if grep -q "sb_secret_QLqZxI4UJgK1WrHRxH2HPw_tZkyYI2t" .env; then
    echo -e "${GREEN}✅ SERVICE_ROLE_KEY configurado corretamente${NC}"
else
    echo -e "${RED}❌ ERRO: SERVICE_ROLE_KEY não encontrado${NC}"
    exit 1
fi

echo ""
echo "🔄 Reiniciando servidor..."

# Tentar PM2 primeiro
if command -v pm2 &> /dev/null; then
    pm2 restart vfs-backend 2>/dev/null || pm2 restart all
    echo -e "${GREEN}✅ PM2 reiniciado${NC}"
    echo ""
    echo "📝 Logs:"
    pm2 logs vfs-backend --lines 20
else
    echo -e "${YELLOW}⚠️  PM2 não encontrado${NC}"
    echo "Reinicie o servidor manualmente:"
    echo "  node server/index.js"
fi

echo ""
echo "=================================="
echo "✅ .env CORRIGIDO!"
echo "=================================="
echo ""
echo "🧪 Para testar delete de usuários:"
echo "1. Acesse o painel admin"
echo "2. Tente deletar um usuário"
echo "3. Verifique os logs: pm2 logs vfs-backend"
echo ""
