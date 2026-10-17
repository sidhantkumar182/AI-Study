import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from token on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await authAPI.getMe();
          if (response.data?.success && response.data?.data?.user) {
            setUser(response.data.data.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Listen for 401 unauthorized events emitted by API interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token: resToken, user: resUser } = response.data.data;
      
      localStorage.setItem('token', resToken);
      setToken(resToken);
      setUser(resUser);
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      const msg = err.response?.data?.message || 'Login failed. Please check your email and password.';
      toast.error(msg);
      return false;
    }
  }, []);

  const register = useCallback(async (name, email, password, confirmPassword) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({
        name,
        email,
        password,
        confirmPassword: confirmPassword || password,
      });
      const { token: resToken, user: resUser } = response.data.data;

      localStorage.setItem('token', resToken);
      setToken(resToken);
      setUser(resUser);
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      const errors = err.response?.data?.errors;
      const firstError = Array.isArray(errors) && errors.length > 0 ? errors[0].msg : null;
      const msg = firstError || err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore logout request errors
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(prev => (prev ? { ...prev, ...updatedUser } : updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
