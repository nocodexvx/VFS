import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiFetch } from "@/services/apiClient";

interface UseUsersParams {
    page: number;
    limit: number;
    search?: string;
    role?: string;
}

interface User {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    avatar_url?: string;
    [key: string]: any;
}

interface UsersResponse {
    users: User[];
    total: number;
    page: number;
    pages: number;
}

export const useUsers = ({ page, limit, search, role }: UseUsersParams) => {
    return useQuery<UsersResponse>({
        queryKey: ['users', { page, limit, search, role }],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (search) params.append('search', search);
            if (role && role !== 'Todos') params.append('role', role);

            return await apiFetch(`/api/admin/users?${params.toString()}`);
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60, // 1 minute
    });
};
