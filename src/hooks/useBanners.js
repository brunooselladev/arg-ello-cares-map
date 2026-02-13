import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/apiClient';
export function useBanners() {
    return useQuery({
        queryKey: ['banners'],
        queryFn: () => apiRequest('/banners'),
    });
}
export function useCreateBanner() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (imageUrl) => apiRequest('/banners', {
            method: 'POST',
            body: { imageUrl },
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
    });
}
export function useDeleteBanner() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiRequest(`/banners/${id}`, {
            method: 'DELETE',
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
    });
}
