import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/apiClient';
export function useThemeConfig() {
    return useQuery({
        queryKey: ['theme-config'],
        queryFn: () => apiRequest('/config'),
    });
}
export function useUpdateThemeConfig() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (primaryColor) => apiRequest('/config', {
            method: 'PATCH',
            body: { primaryColor },
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['theme-config'] });
        },
    });
}
