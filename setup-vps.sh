#!/bin/bash

# ============================================
# SCRIPT DE SETUP AUTOMÁTICO - VFS BACKEND
# ============================================

set -e  # Parar se houver erro

echo "=================================="
echo "🚀 VFS Backend - Setup Automático"
echo "=================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Este script precisa ser executado como root${NC}"
    echo "Execute: sudo bash setup-vps.sh"
    exit 1
fi

echo -e "${GREEN}✅ Rodando como root${NC}"
echo ""

# Verificar Node.js
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js não encontrado. Instalando...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js instalado: $NODE_VERSION${NC}"
fi

# Verificar PM2
echo "📦 Verificando PM2..."
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 não encontrado. Instalando...${NC}"
    npm install -g pm2
else
    PM2_VERSION=$(pm2 -v)
    echo -e "${GREEN}✅ PM2 instalado: $PM2_VERSION${NC}"
fi

echo ""
echo "=================================="
echo "📁 Configurando Diretório"
echo "=================================="

# Definir diretório do projeto
PROJECT_DIR="/var/www/VFS"

# Se diretório não existe, clonar
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}⚠️  Diretório não encontrado. Deseja clonar do GitHub? (y/n)${NC}"
    read -r CLONE_RESPONSE
    if [ "$CLONE_RESPONSE" = "y" ]; then
        mkdir -p /var/www
        cd /var/www
        echo "🔄 Clonando repositório..."
        git clone https://github.com/nocodexvx/VFS.git
    else
        echo -e "${RED}❌ Abortado. Crie o diretório manualmente.${NC}"
        exit 1
    fi
fi

cd "$PROJECT_DIR"
echo -e "${GREEN}✅ Navegado para: $PROJECT_DIR${NC}"

# Atualizar código se já existe
echo ""
echo "🔄 Atualizando código..."
git fetch --all
git pull origin main || git pull origin master || echo "⚠️  Pull manual pode ser necessário"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install

echo ""
echo "=================================="
echo "🔧 Configurando Variáveis de Ambiente"
echo "=================================="

# Verificar se .env existe
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env já existe.${NC}"
    echo "Deseja sobrescrever com as credenciais corretas? (y/n)"
    read -r OVERWRITE_ENV
    if [ "$OVERWRITE_ENV" != "y" ]; then
        echo "Mantendo .env existente."
    else
        rm .env
        echo "Arquivo .env removido para recriar."
    fi
fi

if [ ! -f ".env" ]; then
    echo "📝 Criando arquivo .env..."
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
    echo -e "${GREEN}✅ Arquivo .env criado${NC}"
fi

# Verificar se SERVICE_ROLE_KEY está no .env
if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env; then
    echo -e "${GREEN}✅ SUPABASE_SERVICE_ROLE_KEY encontrado no .env${NC}"
else
    echo -e "${RED}❌ SUPABASE_SERVICE_ROLE_KEY não encontrado!${NC}"
    exit 1
fi

echo ""
echo "=================================="
echo "🚀 Iniciando Servidor"
echo "=================================="

# Parar processo existente se houver
pm2 stop vfs-backend 2>/dev/null || echo "Nenhum processo para parar"
pm2 delete vfs-backend 2>/dev/null || echo "Nenhum processo para deletar"

# Iniciar novo processo
echo "🔄 Iniciando servidor com PM2..."
pm2 start server/index.js --name vfs-backend --env production

# Salvar configuração PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup systemd -u root --hp /root

echo ""
echo "=================================="
echo "✅ SETUP COMPLETO!"
echo "=================================="
echo ""
echo "📊 Status do servidor:"
pm2 status

echo ""
echo "📝 Logs em tempo real:"
echo "   pm2 logs vfs-backend"
echo ""
echo "🔄 Reiniciar:"
echo "   pm2 restart vfs-backend"
echo ""
echo "🛑 Parar:"
echo "   pm2 stop vfs-backend"
echo ""
echo "🧪 Testar backend:"
echo "   curl http://localhost:5000/health"
echo ""
echo "🔍 Ver logs dos últimos deletes:"
echo "   pm2 logs vfs-backend --lines 100 | grep DELETE"
echo ""

# Testar endpoint
echo "🧪 Testando endpoint..."
sleep 3
curl -s http://localhost:5000/health && echo -e "${GREEN}✅ Backend respondendo!${NC}" || echo -e "${RED}❌ Backend não responde${NC}"

echo ""
echo "=================================="
echo "🎉 Pronto para usar!"
echo "=================================="
