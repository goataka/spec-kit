import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { LoginDto, RegisterDto, AuthResponse } from '@repo/shared';

type AuthUser = AuthResponse['user'];

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const register = async (data: RegisterDto) => {
    const response = await authService.register(data);
    setUser(response.user);
  };

  const login = async (data: LoginDto) => {
    const response = await authService.login(data);
    setUser(response.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = user?.role === 'ADMIN';

  return {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  };
};
