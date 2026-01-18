import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/services/apiClient";

interface Subscription {
    id: string;
    user_id: string;
    plan_id: string;
    status: string;
    stripe_customer_id: string;
    created_at: string;
    users?: {
        full_name?: string;
        email: string;
        avatar_url?: string;
    };
    [key: string]: any;
}

interface SubscriptionsResponse {
    subscriptions: Subscription[];
}

export const useSubscriptions = () => {
    return useQuery<SubscriptionsResponse>({
        queryKey: ['subscriptions'],
        queryFn: async () => {
            return await apiFetch('/api/admin/subscriptions');
        },
        staleTime: 1000 * 30, // 30 seconds
        refetchInterval: 1000 * 30, // Poll every 30 seconds
        retry: (failureCount, error) => {
            if (error.message.includes('401') || error.message.includes('403') || error.message.includes('404')) return false;
            return failureCount < 2;
        }
    });
};
