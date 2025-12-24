import { PrivateRoute } from './PrivateRoute';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute component - Protects routes that require admin privileges
 * Redirects to login if not authenticated, shows 403 if not admin
 */
export function AdminRoute({ children }: AdminRouteProps) {
  return <PrivateRoute requireAdmin={true}>{children}</PrivateRoute>;
}
