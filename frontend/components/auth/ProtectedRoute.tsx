'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'participant';
  redirectTo?: string;
}

/**
 * Protected Route Component
 * 
 * Wraps pages that require authentication.
 * Optionally restricts access to specific roles.
 * 
 * @param children - Protected page content
 * @param requiredRole - Optional role requirement ('admin' or 'participant')
 * @param redirectTo - Custom redirect path (default: '/login')
 */
export default function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to login
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Role check - redirect if unauthorized
      if (requiredRole && user.role !== requiredRole) {
        // Admin trying to access participant routes - allow
        if (requiredRole === 'participant' && user.role === 'admin') {
          return;
        }
        // Participant trying to access admin routes - deny
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, requiredRole, redirectTo]);

  // Show loading while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Role check failed (participant trying to access admin routes)
  if (requiredRole === 'admin' && user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
