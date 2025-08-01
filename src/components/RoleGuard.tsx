import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback,
  redirectTo
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Loading state - don't show anything while checking auth
  if (user === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Check if user has required role
  if (!user || !allowedRoles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-destructive" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Access Denied
                </h3>
                <p className="text-muted-foreground mb-4">
                  You don't have permission to access this page. This area is restricted to {allowedRoles.join(' and ')} users only.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </Button>
                <Button 
                  onClick={() => navigate(redirectTo || (user.role === 'admin' ? '/admin-dashboard' : '/cashier-dashboard'))}
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

// Hook for checking roles in components
export const useRoleCheck = () => {
  const { user } = useAuth();
  
  const hasRole = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  const isAdmin = (): boolean => hasRole(['admin']);
  const isCashier = (): boolean => hasRole(['cashier']);
  const canAccess = (requiredRoles: UserRole[]): boolean => hasRole(requiredRoles);

  return {
    user,
    hasRole,
    isAdmin,
    isCashier,
    canAccess
  };
};

// Higher-order component for role protection
export const withRoleGuard = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[],
  redirectTo?: string
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <RoleGuard allowedRoles={allowedRoles} redirectTo={redirectTo}>
        <Component {...props} />
      </RoleGuard>
    );
  };

  WrappedComponent.displayName = `withRoleGuard(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Component for conditional rendering based on roles
interface RoleBasedRenderProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleBasedRender: React.FC<RoleBasedRenderProps> = ({
  allowedRoles,
  children,
  fallback = null
}) => {
  const { hasRole } = useRoleCheck();
  
  if (hasRole(allowedRoles)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};