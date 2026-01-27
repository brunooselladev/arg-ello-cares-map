import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Volunteer, ContactMessage } from '@/types/database';

// Volunteer form submission (public)
export function useSubmitVolunteer() {
  return useMutation({
    mutationFn: async (volunteer: Omit<Volunteer, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('volunteers')
        .insert(volunteer)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

// Contact form submission (public)
export function useSubmitContact() {
  return useMutation({
    mutationFn: async (message: Omit<ContactMessage, 'id' | 'created_at' | 'is_read'>) => {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert(message)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

// Admin: View volunteers
export function useVolunteers() {
  return useQuery({
    queryKey: ['volunteers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Volunteer[];
    },
  });
}

// Admin: View contact messages
export function useContactMessages() {
  return useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContactMessage[];
    },
  });
}

// Admin: Mark message as read
export function useMarkMessageRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
    },
  });
}
