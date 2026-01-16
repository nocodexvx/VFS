import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const { isAdmin, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/dashboard');
        }
    }, [isAdmin, loading, navigate]);

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-purple-500/30">
            <AdminSidebar collapsed={collapsed} toggleCollapse={() => setCollapsed(!collapsed)} />
            <AdminHeader collapsed={collapsed} />

            <main
                className={cn(
                    "pt-24 pb-12 px-6 min-h-screen transition-all duration-300",
                    collapsed ? "ml-[72px]" : "ml-[260px]"
                )}
            >
                <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
