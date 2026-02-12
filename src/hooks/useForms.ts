import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/apiClient';
import type { ContactMessage, Volunteer } from '@/types/database';

export function useSubmitVolunteer() {
  return useMutation({
    mutationFn: (volunteer: Omit<Volunteer, 'id' | 'created_at'>) =>
      apiRequest<Volunteer>('/forms/volunteers', {
        method: 'POST',
        body: volunteer,
      }),
  });
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: (message: Omit<ContactMessage, 'id' | 'created_at' | 'is_read'>) =>
      apiRequest<ContactMessage>('/forms/contact', {
        method: 'POST',
        body: message,
      }),
  });
}

export function useVolunteers() {
  return useQuery({
    queryKey: ['volunteers'],
    queryFn: () => apiRequest<Volunteer[]>('/forms/volunteers'),
  });
}

export function useContactMessages() {
  return useQuery({
    queryKey: ['contact-messages'],
    queryFn: () => apiRequest<ContactMessage[]>('/forms/contact-messages'),
  });
}

export function useMarkMessageRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest<ContactMessage>(`/forms/contact-messages/${id}/read`, {
        method: 'PATCH',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
    },
  });
}
