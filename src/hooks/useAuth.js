import { useEffect, useState } from 'react';
import { apiRequest, setStoredAuthToken, getStoredAuthToken } from '@/lib/apiClient';
export function useAuth() {
    const [state, setState] = useState({
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
                const user = await apiRequest('/auth/me', { auth: true });
                setState({ user, isAdmin: user.role === 'admin', isLoading: false });
            }
            catch {
                setStoredAuthToken(null);
                setState({ user: null, isAdmin: false, isLoading: false });
            }
        };
        void bootstrap();
    }, []);
    const signIn = async (email, password) => {
        try {
            const response = await apiRequest('/auth/login', {
                method: 'POST',
                body: { email, password },
            });
            setStoredAuthToken(response.token);
            setState({ user: response.user, isAdmin: response.user.role === 'admin', isLoading: false });
            return { error: null };
        }
        catch (error) {
            return { error };
        }
    };
    const signUp = async (email, password) => {
        try {
            const response = await apiRequest('/auth/register', {
                method: 'POST',
                body: { email, password },
            });
            setStoredAuthToken(response.token);
            setState({ user: response.user, isAdmin: response.user.role === 'admin', isLoading: false });
            return { error: null };
        }
        catch (error) {
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
