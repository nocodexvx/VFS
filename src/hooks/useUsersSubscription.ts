import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useUsersSubscription = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const channel = supabase
            .channel('public:users')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'users',
                },
                () => {
                    // Invalidate and refetch users query
                    queryClient.invalidateQueries({ queryKey: ['users'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);
};
