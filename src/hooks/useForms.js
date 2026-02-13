import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/apiClient';
export function useSubmitVolunteer() {
    return useMutation({
        mutationFn: (volunteer) => apiRequest('/forms/volunteers', {
            method: 'POST',
            body: volunteer,
        }),
    });
}
export function useSubmitContact() {
    return useMutation({
        mutationFn: (message) => apiRequest('/forms/contact', {
            method: 'POST',
            body: message,
        }),
    });
}
export function useVolunteers() {
    return useQuery({
        queryKey: ['volunteers'],
        queryFn: () => apiRequest('/forms/volunteers'),
    });
}
export function useContactMessages() {
    return useQuery({
        queryKey: ['contact-messages'],
        queryFn: () => apiRequest('/forms/contact-messages'),
    });
}
export function useMarkMessageRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiRequest(`/forms/contact-messages/${id}/read`, {
            method: 'PATCH',
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
        },
    });
}
