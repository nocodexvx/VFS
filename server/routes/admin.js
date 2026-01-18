import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { requireAdmin } from '../middleware/auth.js';

dotenv.config();

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// SERVICE ROLE CLIENT (Required for Admin User Actions & Bypassing RLS)
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_KEY || process.env.SUPABASE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// LIST USERS (Paginated & Filtered)
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const role = req.query.role || '';

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Base query
        let query = supabaseAdmin
            .from('users')
            .select('*', { count: 'exact' });

        // Apply filters
        if (role && role !== 'Todos' && role !== 'all') {
            query = query.eq('role', role);
        }

        if (search) {
            // ILIKE for case-insensitive search on email or full_name
            query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
        }

        // Apply pagination & ordering
        query = query.order('created_at', { ascending: false })
            .range(from, to);

        const { data: users, error, count } = await query;

        if (error) throw error;

        res.json({
            users,
            total: count,
            page,
            pages: Math.ceil(count / limit)
        });
    } catch (e) {
        console.error("Error fetching users:", e);
        res.status(500).json({ error: e.message });
    }
});

// CREATE USER (ADMIN ONLY)
router.post('/users', requireAdmin, async (req, res) => {
    try {
        const { role, plan } = req.body;
        const email = req.body.email?.trim();
        const password = req.body.password?.trim();
        const fullName = req.body.fullName?.trim();

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        console.log(`[Admin] Creating user: ${email}`);

        // 0. ANTIGRAVITY FIX: Check for "Zombie" users in public DB
        // If a user exists in public.users but NOT in Auth (zombie), the trigger will fail on unique email constraint.
        const { data: zombieUser } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (zombieUser) {
            console.warn(`[Admin] Found zombie user ${zombieUser.id} with email ${email}. Cleaning up...`);
            await supabaseAdmin.from('users').delete().eq('id', zombieUser.id);
            // Also clean subscriptions to be safe
            await supabaseAdmin.from('subscriptions').delete().eq('user_id', zombieUser.id);
        }

        // 1. Create Auth User (Supabase Auth)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: fullName }
        });

        if (authError) {
            console.error("Auth Create Error:", authError);
            if (authError.message.includes("already registered") || authError.status === 422) {
                return res.status(409).json({ error: 'Este email já está cadastrado.' });
            }
            return res.status(400).json({ error: `Erro no Auth: ${authError.message}` });
        }

        const userId = authData.user.id;
        console.log(`[Admin] Auth user created: ${userId}`);

        // 2. UPDATE User Role (Public Schema)
        // trigger 'on_auth_user_created' already created the public.users row.
        // We just need to update the role if it was set to something other than 'user'
        if (role && role !== 'user') {
            const { error: dbError } = await supabaseAdmin
                .from('users')
                .update({ role })
                .eq('id', userId);

            if (dbError) {
                console.error("DB Update Role Error:", dbError);
                // Non-critical: user is created, just role is wrong.
            }
        }

        // 3. Insert Subscription (if plan selected)
        // 3. Insert Subscription (if plan selected)
        let createdSubscription = null;
        if (plan && plan !== 'none') {
            const { data: subData, error: subError } = await supabaseAdmin
                .from('subscriptions')
                .insert({
                    user_id: userId,
                    status: 'active', // Admin granted access
                    plan_id: plan,
                    current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year free
                    created_at: new Date()
                })
                .select()
                .single();

            if (subError) {
                console.error("Error creating manual subscription:", subError);
                // NOT blocking user creation, but logging it.
            } else {
                createdSubscription = subData;
                console.log(`[Admin] Manual subscription created: ${subData.id}`);
            }
        }

        res.json({ message: 'Usuário criado com sucesso!', user: authData.user });

    } catch (e) {
        console.error("Critical Error in create user:", e);
        res.status(500).json({ error: e.message });
    }
});

// BAN / UNBAN USER
router.post('/users/:id/ban', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { banned } = req.body; // true to ban, false to unban

        // 1. Update Auth User (ban_duration)
        const banDuration = banned ? '876000h' : 'none'; // 100 years or none
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            id,
            { ban_duration: banDuration }
        );

        if (authError) {
            // Fallback: Just mark in DB if auth fails (e.g. no service key)
            console.warn("Auth Ban Failed (likely no Service Key), updating DB only.");
        }

        // 2. Update DB Role/Status (Visual indicator)
        const { error: dbError } = await supabase
            .from('users')
            .update({ role: banned ? 'banned' : 'user' }) // Reset to user on unban
            .eq('id', id);

        if (dbError) throw dbError;

        res.json({ message: `Usuário ${banned ? 'banido' : 'desbanido'} com sucesso.` });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// DELETE USER
router.delete('/users/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[ADMIN DELETE] Starting deletion for user: ${id}`);

        // 0. Delete subscriptions first (explicit cleanup)
        const { error: subError } = await supabaseAdmin.from('subscriptions').delete().eq('user_id', id);
        if (subError) {
            console.error("[DELETE] Subscriptions delete error:", subError);
        } else {
            console.log("[DELETE] Subscriptions deleted successfully");
        }

        // 1. Delete ai_usage_logs (explicit cleanup)
        const { error: logsError } = await supabaseAdmin.from('ai_usage_logs').delete().eq('user_id', id);
        if (logsError) {
            console.error("[DELETE] AI logs delete error:", logsError);
        } else {
            console.log("[DELETE] AI logs deleted successfully");
        }

        // 2. Delete from Supabase Auth (This is the master record)
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

        if (authError) {
            console.error("[DELETE] Auth Delete Error:", authError);
            // Ignore "User not found" error to allow cleaning up public table
            if (!authError.message.includes("User not found") && authError.status !== 404) {
                return res.status(400).json({ error: `Falha ao excluir usuário do Auth: ${authError.message}` });
            }
            console.warn("[DELETE] User not found in Auth, proceeding to delete from DB.");
        } else {
            console.log("[DELETE] Auth user deleted successfully");
        }

        // 3. Delete from Public Table (If cascade not set up, though usually it is. We do it to be safe)
        const { data: deletedUsers, error: dbError, count } = await supabaseAdmin
            .from('users')
            .delete({ count: 'exact' })
            .eq('id', id)
            .select();

        if (dbError) {
            console.error("[DELETE] DB Delete Error:", dbError);
            return res.status(500).json({ error: `Erro ao deletar do banco público: ${dbError.message}` });
        }

        console.log("[DELETE] Public user delete result:", { deletedUsers, count });

        if (!deletedUsers || deletedUsers.length === 0) {
            console.warn("[DELETE] No user was deleted from public.users table");
            return res.status(404).json({ error: 'Usuário não encontrado no banco de dados.' });
        }

        console.log(`[ADMIN DELETE] User ${id} deleted completely`);
        res.json({
            message: 'Usuário excluído permanentemente.',
            deletedCount: deletedUsers.length
        });

    } catch (e) {
        console.error("[DELETE] Critical error:", e);
        res.status(500).json({ error: e.message });
    }
});

export default router;
