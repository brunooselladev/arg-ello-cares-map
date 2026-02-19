import { QueryClient } from '@tanstack/react-query';

// Crear instancia de QueryClient con configuración optimizada
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache agresivo para datos que no cambian frecuentemente
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos (era cacheTime)
        retry: 1,
        refetchOnWindowFocus: false, // No refetch al volver a la ventana
        refetchOnReconnect: 'stale', // Solo refetch si está stale
        refetchOnMount: 'stale', // Solo refetch si está stale
      },
      mutations: {
        retry: 1,
      },
    },
  });
}
