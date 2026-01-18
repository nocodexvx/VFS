import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/services/apiClient";

interface AILog {
    id: string;
    user_id: string;
    feature: string;
    provider: string;
    cost_tokens: number;
    status: string;
    created_at: string;
    users?: {
        email: string;
    };
    [key: string]: any;
}

interface AILogsResponse {
    logs: AILog[];
}

export const useAILogs = () => {
    return useQuery<AILogsResponse>({
        queryKey: ['ai-logs'],
        queryFn: async () => {
            return await apiFetch('/api/admin/logs');
        },
        staleTime: 1000 * 30, // 30 seconds
        refetchInterval: 1000 * 60, // Poll every 60 seconds (logs less critical than subscriptions)
        retry: (failureCount, error) => {
            if (error.message.includes('401') || error.message.includes('403') || error.message.includes('404')) return false;
            return failureCount < 2;
        }
    });
};
