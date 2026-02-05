'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import AuthLayout from '@/components/layouts/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorAlert from '@/components/ui/ErrorAlert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user, loading: authLoading, getRedirectPath } = useAuth();
  const router = useRouter();

  // Redirect authenticated users based on their role
  useEffect(() => {
    if (!authLoading && user) {
      router.push(getRedirectPath(user));
    }
  }, [user, authLoading, router, getRedirectPath]);

  // Show loading while checking auth
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Don't render form if already authenticated
  if (user) {
    return <LoadingSpinner />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const newUser = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        profilePicture: formData.profilePicture || 'https://ui-avatars.com/api/?name=' + formData.firstName + '+' + formData.lastName,
      });
      // New users are participants, redirect to participant dashboard
      router.push(getRedirectPath(newUser));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join us and start organizing events">
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="firstName"
            name="firstName"
            type="text"
            label="First Name"
            icon={<User className="w-5 h-5" />}
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
          />

          <Input
            id="lastName"
            name="lastName"
            type="text"
            label="Last Name"
            icon={<User className="w-5 h-5" />}
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
          />
        </div>

        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          icon={<Mail className="w-5 h-5" />}
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />

        <Input
          id="profilePicture"
          name="profilePicture"
          type="url"
          label="Profile Picture URL (Optional)"
          icon={<ImageIcon className="w-5 h-5" />}
          value={formData.profilePicture}
          onChange={handleChange}
          placeholder="https://example.com/avatar.jpg"
        />

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2 text-white">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className="glass-card w-full pl-11 pr-12 py-3 rounded-lg outline-none transition-all text-white placeholder-white/40"
              style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(78, 205, 196, 0.6)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(78, 205, 196, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              }}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors text-white/50 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-white">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="glass-card w-full pl-11 pr-12 py-3 rounded-lg outline-none transition-all text-white placeholder-white/40"
              style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(78, 205, 196, 0.6)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(78, 205, 196, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              }}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/70">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: '#4ecdc4' }}>
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
