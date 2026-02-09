/**
 * Authentication Layout Component
 * 
 * Premium layout for authentication pages with elegant styling.
 * Supports dark/light themes via CSS variables.
 * Part of the EventBook design system.
 * 
 * @component
 */

import { ReactNode } from 'react';
import Link from 'next/link';
import Logo from '../Logo';
import ThemeToggle from '../ui/ThemeToggle';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

/**
 * Auth Layout Component
 * 
 * Elegant, minimal centered layout for authentication flows.
 */
export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="p-6">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" />
            <Link 
              href="/" 
              className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors link-underline"
            >
              Back to home
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full animate-fade-in-up">
          {/* Auth Card */}
          <div 
            className="
              bg-[var(--bg-elevated)] 
              border border-[var(--border-default)] 
              rounded-xl p-8 
              shadow-[var(--shadow-md)]
              transition-all duration-300
            "
          >
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2 tracking-tight">
                {title}
              </h1>
              <p className="text-[var(--text-secondary)]">{subtitle}</p>
            </div>

            {/* Form Content */}
            {children}
          </div>

          {/* Legal Disclaimer */}
          <p className="text-center text-xs mt-6 text-[var(--text-tertiary)]">
            By continuing, you agree to our{' '}
            <Link 
              href="/terms" 
              className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link 
              href="/privacy" 
              className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
