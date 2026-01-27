import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MapPoint, MapPointType } from '@/types/database';

export function useMapPoints(filterType?: MapPointType | null) {
  return useQuery({
    queryKey: ['map-points', filterType],
    queryFn: async () => {
      let query = supabase
        .from('map_points')
        .select('*')
        .order('name');

      if (filterType) {
        query = query.eq('point_type', filterType);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as MapPoint[];
    },
  });
}

export function useCreateMapPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (point: Omit<MapPoint, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('map_points')
        .insert(point)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map-points'] });
    },
  });
}

export function useUpdateMapPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MapPoint> & { id: string }) => {
      const { data, error } = await supabase
        .from('map_points')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map-points'] });
    },
  });
}

export function useDeleteMapPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('map_points')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map-points'] });
    },
  });
}
