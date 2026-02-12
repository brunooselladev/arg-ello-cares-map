import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/apiClient';
import type { Campaign } from '@/types/database';

export function useCampaigns(limit?: number) {
  return useQuery({
    queryKey: ['campaigns', limit],
    queryFn: () =>
      apiRequest<Campaign[]>('/campaigns', {
        params: {
          limit,
        },
      }),
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>) =>
      apiRequest<Campaign>('/campaigns', {
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
    mutationFn: ({ id, ...updates }: Partial<Campaign> & { id: string }) =>
      apiRequest<Campaign>(`/campaigns/${id}`, {
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
    mutationFn: (id: string) =>
      apiRequest<{ msg: string }>(`/campaigns/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
