import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SiteConfig } from '@/types/database';

export function useSiteConfig(key: string) {
  return useQuery({
    queryKey: ['site-config', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('key', key)
        .maybeSingle();

      if (error) throw error;
      return data as SiteConfig | null;
    },
  });
}

export function useAppUserCount() {
  const { data, isLoading } = useSiteConfig('app_user_count');
  return {
    count: data?.value ? parseInt(data.value, 10) : 0,
    isLoading,
  };
}

export function useUpdateSiteConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data, error } = await supabase
        .from('site_config')
        .update({ value })
        .eq('key', key)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['site-config', variables.key] });
    },
  });
}
