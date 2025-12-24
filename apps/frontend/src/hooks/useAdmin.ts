import { useAuth } from './useAuth';

export const useAdmin = () => {
  const { user, isAdmin } = useAuth();

  const canManageUsers = isAdmin;
  const canManageEmployees = isAdmin;
  const canViewAllClocks = isAdmin;

  return {
    user,
    isAdmin,
    canManageUsers,
    canManageEmployees,
    canViewAllClocks,
  };
};
