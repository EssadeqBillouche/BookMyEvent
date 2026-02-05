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

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/layouts/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorAlert from '@/components/ui/ErrorAlert';

/**
 * Login Page Component
 * 
 * Handles user authentication and redirects to dashboard on success.
 * 
 * @returns JSX login page with form
 */
export default function LoginPage() {
  // Form state management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  /**
   * Handle Login Form Submission
   * 
   * Validates and submits login credentials.
   * On success, redirects to dashboard.
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
      await login(email, password);
      
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err: any) {
      // Display user-friendly error message
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue to your account">
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold" style={{ color: '#003580' }}>
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
