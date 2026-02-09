/**
 * Navigation Bar Component
 * 
 * Premium navigation with elegant styling and theme support.
 * Part of the EventBook design system.
 * 
 * @component
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Menu, X } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ui/ThemeToggle';

/**
 * Navbar Component
 * 
 * Elegant, minimal navigation bar with authentication-aware UI.
 * Includes theme toggle and smooth scroll effects.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav
      className={`
        sticky top-0 z-50 transition-all duration-300
        ${scrolled 
          ? 'bg-[var(--bg-primary)]/95 backdrop-blur-md shadow-[var(--shadow-sm)] border-b border-[var(--border-subtle)]' 
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Public Events Link */}
            <Link
              href="/events"
              className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-hover)]"
            >
              Browse Events
            </Link>

            {user ? (
              <>
                {/* Admin Links */}
                {user.role === 'admin' && (
                  <>
                    <Link
                      href="/admin/dashboard"
                      className="px-4 py-2 text-sm font-medium text-[var(--accent-primary)] hover:bg-[var(--accent-primary-muted)] transition-colors rounded-lg"
                    >
                      Admin
                    </Link>
                    <Link
                      href="/admin/events"
                      className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-hover)]"
                    >
                      Manage Events
                    </Link>
                  </>
                )}
                
                {/* Dashboard Link */}
                <Link
                  href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-hover)]"
                >
                  Dashboard
                </Link>

                <div className="w-px h-6 bg-[var(--border-default)] mx-2" />
                
                {/* Theme Toggle */}
                <ThemeToggle size="sm" />
                
                {/* Welcome Message */}
                <span className="text-sm text-[var(--text-tertiary)] px-2">
                  Hi, <span className="font-medium text-[var(--text-primary)]">{user.firstName}</span>
                </span>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-hover)]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Theme Toggle */}
                <ThemeToggle size="sm" className="mr-2" />
                
                {/* Login Link */}
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-hover)]"
                >
                  Log in
                </Link>
                
                {/* Sign Up Button */}
                <Link
                  href="/register"
                  className="ml-2 px-5 py-2 text-sm font-medium text-[var(--text-inverse)] bg-[var(--accent-primary)] rounded-lg transition-all hover:bg-[var(--accent-primary-hover)] hover:shadow-[var(--shadow-md)]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle size="sm" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border-default)] animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link
                href="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
              >
                Browse Events
              </Link>

              {user ? (
                <>
                  {user.role === 'admin' && (
                    <>
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 text-sm font-medium text-[var(--accent-primary)] hover:bg-[var(--accent-primary-muted)] rounded-lg transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                      <Link
                        href="/admin/events"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                      >
                        Manage Events
                      </Link>
                    </>
                  )}
                  <Link
                    href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                  <div className="h-px bg-[var(--border-default)] my-2" />
                  <div className="px-4 py-2 text-sm text-[var(--text-tertiary)]">
                    Signed in as <span className="font-medium text-[var(--text-primary)]">{user.firstName}</span>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors text-left w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mx-4 mt-2 px-4 py-3 text-sm font-medium text-[var(--text-inverse)] bg-[var(--accent-primary)] rounded-lg text-center transition-all hover:bg-[var(--accent-primary-hover)]"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
