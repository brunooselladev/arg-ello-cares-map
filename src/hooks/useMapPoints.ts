import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/apiClient';
import type { MapPoint, MapPointType } from '@/types/database';

export function useMapPoints(filterType?: MapPointType | null) {
  return useQuery({
    queryKey: ['map-points', filterType],
    queryFn: () =>
      apiRequest<MapPoint[]>('/map-points', {
        params: {
          point_type: filterType ?? undefined,
        },
      }),
  });
}

export function useCreateMapPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (point: Omit<MapPoint, 'id' | 'created_at' | 'updated_at'>) =>
      apiRequest<MapPoint>('/map-points', {
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
    mutationFn: ({ id, ...updates }: Partial<MapPoint> & { id: string }) =>
      apiRequest<MapPoint>(`/map-points/${id}`, {
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
    mutationFn: (id: string) =>
      apiRequest<{ msg: string }>(`/map-points/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map-points'] });
    },
  });
}
