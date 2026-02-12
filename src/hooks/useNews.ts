import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, PaginatedResponse } from '@/lib/apiClient';
import type { News, NewsCategory } from '@/types/database';

export interface CreateNewsInput {
  title: string;
  content: string;
  summary: string;
  image?: string | null;
  category: NewsCategory;
  videoUrl?: string | null;
  date?: string | null;
  author?: string | null;
  tags?: string[] | null;
  visible?: boolean;
}

export interface UpdateNewsInput extends Partial<CreateNewsInput> {
  id: string;
}

export function useNews(category?: NewsCategory | null, limit = 20, includeHidden = false) {
  return useQuery({
    queryKey: ['news', category, limit, includeHidden],
    queryFn: async () => {
      const response = await apiRequest<PaginatedResponse<News>>('/news', {
        params: {
          category: category ?? undefined,
          page: 1,
          limit,
          includeHidden,
        },
      });

      return response.items;
    },
  });
}

export function useNewsPage(
  category: NewsCategory,
  page: number,
  limit: number,
  includeHidden = false,
) {
  return useQuery({
    queryKey: ['news-page', category, page, limit, includeHidden],
    queryFn: () =>
      apiRequest<PaginatedResponse<News>>('/news', {
        params: {
          category,
          page,
          limit,
          includeHidden,
        },
      }),
  });
}

export function useInfiniteNews(category: NewsCategory, limit = 6) {
  return useInfiniteQuery({
    queryKey: ['news-infinite', category, limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      apiRequest<PaginatedResponse<News>>('/news', {
        params: {
          category,
          page: pageParam,
          limit,
          includeHidden: false,
        },
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.totalPages) return undefined;
      return lastPage.page + 1;
    },
  });
}

export function useNewsById(id: string) {
  return useQuery({
    queryKey: ['news', id],
    enabled: Boolean(id),
    queryFn: () => apiRequest<News>(`/news/${id}`),
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNewsInput) =>
      apiRequest<News>('/news', {
        method: 'POST',
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news-page'] });
      queryClient.invalidateQueries({ queryKey: ['news-infinite'] });
    },
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateNewsInput) =>
      apiRequest<News>(`/news/${id}`, {
        method: 'PATCH',
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news-page'] });
      queryClient.invalidateQueries({ queryKey: ['news-infinite'] });
    },
  });
}

export function useToggleNewsVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, visible }: { id: string; visible: boolean }) =>
      apiRequest<News>(`/news/${id}/visibility`, {
        method: 'PATCH',
        body: { visible },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news-page'] });
      queryClient.invalidateQueries({ queryKey: ['news-infinite'] });
    },
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest<{ msg: string }>(`/news/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news-page'] });
      queryClient.invalidateQueries({ queryKey: ['news-infinite'] });
    },
  });
}
