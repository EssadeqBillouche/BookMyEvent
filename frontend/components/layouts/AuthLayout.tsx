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
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-[#4ecdc4]/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-[#4ecdc4]/25 to-transparent rounded-full blur-3xl" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Brand Logo */}
        <div className="flex justify-center mb-10">
          <Logo />
        </div>

        {/* Auth Card - Glassmorphism Popup Modal */}
        <div className="glass-card p-10 backdrop-blur-2xl" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)' }}>
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">{title}</h1>
            <p className="text-white/70">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Legal Disclaimer */}
        <p className="text-center text-sm mt-6 text-white/60">
          By continuing, you agree to our{' '}
          <span className="font-medium text-white/80 hover:text-white cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="font-medium text-white/80 hover:text-white cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
