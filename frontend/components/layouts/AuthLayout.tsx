/**
 * Authentication Layout Component
 * 
 * Specialized layout for authentication pages (login, register).
 * Provides centered card design with branding and legal text.
 * 
 * @component
 */

import { ReactNode } from 'react';
import Logo from '../Logo';

/**
 * Auth Layout Props
 */
interface AuthLayoutProps {
  children: ReactNode;  // Form content (login/register form)
  title: string;        // Page title (e.g., "Welcome Back")
  subtitle: string;     // Descriptive subtitle
}

/**
 * Auth Layout Component
 * 
 * Centered layout for authentication flows with consistent branding.
 * 
 * Features:
 * - Gradient background matching brand colors
 * - Centered card design for focus
 * - Logo placement for brand recognition
 * - Legal disclaimer footer
 * - Responsive padding
 * 
 * @param children - Form content to be displayed
 * @param title - Main heading text
 * @param subtitle - Supporting text below title
 * 
 * @example
 * ```tsx
 * <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
 *   <LoginForm />
 * </AuthLayout>
 * ```
 */
export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Auth Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Legal Disclaimer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
