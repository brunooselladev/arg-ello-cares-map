import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/apiClient';
import type { Banner } from '@/types/database';

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: () => apiRequest<Banner[]>('/banners'),
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageUrl: string) =>
      apiRequest<Banner>('/banners', {
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
    mutationFn: (id: string) =>
      apiRequest<{ msg: string }>(`/banners/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
}
