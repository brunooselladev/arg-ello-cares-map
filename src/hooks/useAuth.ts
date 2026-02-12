import { useEffect, useState } from 'react';
import { apiRequest, setStoredAuthToken, getStoredAuthToken } from '@/lib/apiClient';
import type { AuthUser } from '@/types/database';

interface AuthState {
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    isLoading: true,
  });

  useEffect(() => {
    const bootstrap = async () => {
      const token = getStoredAuthToken();
      if (!token) {
        setState({ user: null, isAdmin: false, isLoading: false });
        return;
      }

      try {
        const user = await apiRequest<AuthUser>('/auth/me', { auth: true });
        setState({ user, isAdmin: user.role === 'admin', isLoading: false });
      } catch {
        setStoredAuthToken(null);
        setState({ user: null, isAdmin: false, isLoading: false });
      }
    };

    void bootstrap();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      setStoredAuthToken(response.token);
      setState({ user: response.user, isAdmin: response.user.role === 'admin', isLoading: false });
      return { error: null };
    } catch (error: unknown) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const response = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: { email, password },
      });

      setStoredAuthToken(response.token);
      setState({ user: response.user, isAdmin: response.user.role === 'admin', isLoading: false });
      return { error: null };
    } catch (error: unknown) {
      return { error };
    }
  };

  const signOut = async () => {
    setStoredAuthToken(null);
    setState({ user: null, isAdmin: false, isLoading: false });
    return { error: null };
  };

  return {
    ...state,
    session: null,
    signIn,
    signUp,
    signOut,
  };
}
