import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/apiClient';
export function useMapPoints(filterType) {
    return useQuery({
        queryKey: ['map-points', filterType],
        queryFn: () => apiRequest('/map-points', {
            params: {
                point_type: filterType ?? undefined,
            },
        }),
    });
}
export function useCreateMapPoint() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (point) => apiRequest('/map-points', {
            method: 'POST',
            body: point,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['map-points'] });
        },
    });
}
export function useUpdateMapPoint() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updates }) => apiRequest(`/map-points/${id}`, {
            method: 'PATCH',
            body: updates,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['map-points'] });
        },
    });
}
export function useDeleteMapPoint() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiRequest(`/map-points/${id}`, {
            method: 'DELETE',
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['map-points'] });
        },
    });
}
