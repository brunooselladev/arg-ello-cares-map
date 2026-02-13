import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/apiClient';
export function useCampaigns(limit) {
    return useQuery({
        queryKey: ['campaigns', limit],
        queryFn: () => apiRequest('/campaigns', {
            params: {
                limit,
            },
        }),
    });
}
export function useCreateCampaign() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (campaign) => apiRequest('/campaigns', {
            method: 'POST',
            body: campaign,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        },
    });
}
export function useUpdateCampaign() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updates }) => apiRequest(`/campaigns/${id}`, {
            method: 'PATCH',
            body: updates,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        },
    });
}
export function useDeleteCampaign() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiRequest(`/campaigns/${id}`, {
            method: 'DELETE',
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        },
    });
}
