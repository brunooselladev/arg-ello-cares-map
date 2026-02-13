import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/apiClient';
export function useNews(category, limit = 20, includeHidden = false) {
    return useQuery({
        queryKey: ['news', category, limit, includeHidden],
        queryFn: async () => {
            const response = await apiRequest('/news', {
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
export function useNewsPage(category, page, limit, includeHidden = false) {
    return useQuery({
        queryKey: ['news-page', category, page, limit, includeHidden],
        queryFn: () => apiRequest('/news', {
            params: {
                category,
                page,
                limit,
                includeHidden,
            },
        }),
    });
}
export function useInfiniteNews(category, limit = 6) {
    return useInfiniteQuery({
        queryKey: ['news-infinite', category, limit],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => apiRequest('/news', {
            params: {
                category,
                page: pageParam,
                limit,
                includeHidden: false,
            },
        }),
        getNextPageParam: (lastPage) => {
            if (lastPage.page >= lastPage.totalPages)
                return undefined;
            return lastPage.page + 1;
        },
    });
}
export function useNewsById(id) {
    return useQuery({
        queryKey: ['news', id],
        enabled: Boolean(id),
        queryFn: () => apiRequest(`/news/${id}`),
    });
}
export function useCreateNews() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => apiRequest('/news', {
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
        mutationFn: ({ id, ...payload }) => apiRequest(`/news/${id}`, {
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
        mutationFn: ({ id, visible }) => apiRequest(`/news/${id}/visibility`, {
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
        mutationFn: (id) => apiRequest(`/news/${id}`, {
            method: 'DELETE',
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
            queryClient.invalidateQueries({ queryKey: ['news-page'] });
            queryClient.invalidateQueries({ queryKey: ['news-infinite'] });
        },
    });
}
