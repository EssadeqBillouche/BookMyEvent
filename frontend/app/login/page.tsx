/**
 * Login Page
 * 
 * User authentication page with email/password login.
 * Implements HTTP-only cookie-based authentication.
 * 
 * Features:
 * - Email and password input validation
 * - Password visibility toggle
 * - Error handling and display
 * - Loading state during authentication
 * - Redirect to dashboard on success
 * 
 * @page
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/layouts/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorAlert from '@/components/ui/ErrorAlert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * Login Form Component
 * 
 * Internal component that uses useSearchParams.
 * Wrapped in Suspense boundary by parent component.
 */
function LoginForm() {
  // Form state management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user, loading: authLoading, getRedirectPath } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  // Redirect authenticated users based on their role
  useEffect(() => {
    if (!authLoading && user) {
      // If there's a redirect URL, use it; otherwise use role-based redirect
      router.push(redirectUrl || getRedirectPath(user));
    }
  }, [user, authLoading, router, getRedirectPath, redirectUrl]);

  // Show loading while checking auth
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Don't render form if already authenticated
  if (user) {
    return <LoadingSpinner />;
  }

  /**
   * Handle Login Form Submission
   * 
   * Validates and submits login credentials.
   * On success, redirects to dashboard or custom redirect URL.
   * On failure, displays error message.
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Authenticate user (sets HTTP-only cookie)
      const loggedInUser = await login(email, password);
      
      // Redirect to custom URL if provided, otherwise role-based redirect
      router.push(redirectUrl || getRedirectPath(loggedInUser));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      // Display user-friendly error message
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to your account">
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="email"
          type="email"
          label="Email Address"
          icon={<Mail className="w-5 h-5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-all focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 hover:border-[var(--border-strong)]"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button type="submit" loading={loading} fullWidth className="mt-6">
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[var(--text-secondary)]">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

/**
 * Login Page Component
 * 
 * Wraps LoginForm in Suspense boundary for useSearchParams support.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginForm />
    </Suspense>
  );
}
