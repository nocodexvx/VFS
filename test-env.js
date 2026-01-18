import dotenv from 'dotenv';
dotenv.config();

console.log('\n=== DIAGNÓSTICO DE VARIÁVEIS DE AMBIENTE ===\n');

const envVars = {
    'SUPABASE_URL': process.env.SUPABASE_URL,
    'SUPABASE_KEY': process.env.SUPABASE_KEY ? process.env.SUPABASE_KEY.substring(0, 20) + '...' : 'NÃO CONFIGURADO',
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...' : 'NÃO CONFIGURADO',
    'VITE_SUPABASE_URL': process.env.VITE_SUPABASE_URL,
    'VITE_SUPABASE_KEY': process.env.VITE_SUPABASE_KEY ? process.env.VITE_SUPABASE_KEY.substring(0, 20) + '...' : 'NÃO CONFIGURADO',
    'DATABASE_URL': process.env.DATABASE_URL ? 'CONFIGURADO' : 'NÃO CONFIGURADO',
    'DIRECT_URL': process.env.DIRECT_URL ? 'CONFIGURADO' : 'NÃO CONFIGURADO',
    'PORT': process.env.PORT || '3000 (padrão)',
    'NODE_ENV': process.env.NODE_ENV || 'development (padrão)'
};

Object.entries(envVars).forEach(([key, value]) => {
    const status = value === 'NÃO CONFIGURADO' ? '❌' : '✅';
    console.log(`${status} ${key}: ${value}`);
});

console.log('\n=== CHAVE USADA PELO ADMIN ===');
const keyUsed = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE_KEY ✅' :
                process.env.VITE_SUPABASE_KEY ? 'VITE_SUPABASE_KEY ⚠️' :
                'SUPABASE_KEY ❌';
console.log(`Admin usará: ${keyUsed}`);

console.log('\n=== PODE DELETAR USUÁRIOS? ===');
const canDelete = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log(canDelete ? '✅ SIM - SERVICE_ROLE_KEY configurado' : '❌ NÃO - SERVICE_ROLE_KEY ausente');

console.log('\n');
