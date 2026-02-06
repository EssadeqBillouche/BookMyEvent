/**
 * Navigation Bar Component
 * 
 * Global navigation component displayed across all pages.
 * Shows different content based on authentication state.
 * 
 * Features:
 * - Logo with home link
 * - User greeting when authenticated
 * - Login/Signup buttons when not authenticated
 * - Logout functionality
 * 
 * @component
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import Logo from './Logo';

/**
 * Navbar Component
 * 
 * Responsive navigation bar with authentication-aware UI.
 * Uses sticky positioning to remain visible during scroll.
 * Features dynamic opacity that increases on scroll for better visibility.
 * 
 * @returns JSX navigation element
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  /**
   * Track scroll position to update navbar opacity
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Handle Logout
   * 
   * Logs out user and redirects to home page.
   * Clears HTTP-only cookie via backend API call.
   * 
   * @async
   */
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav
      className={`glass-card sticky transition-all duration-300 ease-out z-50 
        ${scrolled ? 'top-0 left-0 w-full mx-0 rounded-none h-20 shadow-lg shadow-black/20' : 'top-4 mx-4 rounded-2xl'}
      `}
      style={{
        background: scrolled
          ? 'rgba(29, 48, 63, 0.98)'
          : 'rgba(255, 255, 255, 0.1)',
        borderColor: scrolled
          ? 'rgba(78, 205, 196, 0.3)'
          : 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        margin: scrolled ? 0 : undefined,
        borderRadius: scrolled ? 0 : undefined,
        left: scrolled ? 0 : undefined,
        right: scrolled ? 0 : undefined,
        width: scrolled ? '100vw' : undefined,
        height: scrolled ? '5rem' : undefined,
      }}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${scrolled ? 'h-20' : ''}`}>
        <div className={`flex justify-between items-center ${scrolled ? 'h-20' : 'h-16'}`}>
          {/* Brand Logo */}
          <Logo />
          
          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            {/* Public Events Link - visible to everyone */}
            <Link
              href="/events"
              className="px-4 py-2 font-medium transition-all rounded-lg text-white hover:bg-white/10"
            >
              Events
            </Link>

            {user ? (
              /* Authenticated User UI */
              <>
                {/* Admin Links */}
                {user.role === 'admin' && (
                  <>
                    <Link
                      href="/admin/dashboard"
                      className="px-4 py-2 font-medium transition-all rounded-lg text-[#4ecdc4] hover:bg-[#4ecdc4]/10"
                    >
                      Admin
                    </Link>
                    <Link
                      href="/admin/events"
                      className="px-4 py-2 font-medium transition-all rounded-lg text-white hover:bg-white/10"
                    >
                      Manage Events
                    </Link>
                  </>
                )}
                
                {/* Dashboard Link */}
                <Link
                  href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className="px-4 py-2 font-medium transition-all rounded-lg text-white hover:bg-white/10"
                >
                  Dashboard
                </Link>
                
                {/* Welcome Message */}
                <span className="text-sm text-white/70 hidden sm:inline">
                  Welcome, <span className="font-semibold text-white">{user.firstName}</span>
                </span>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="glass-card flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-white hover:shadow-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              /* Guest User UI */
              <>
                {/* Login Link */}
                <Link 
                  href="/login" 
                  className="px-4 py-2 font-medium transition-all rounded-lg text-white hover:bg-white/10" 
                >
                  Login
                </Link>
                
                {/* Sign Up Button */}
                <Link
                  href="/register"
                  className="glass-card px-6 py-2 text-white rounded-lg transition-all duration-200 font-medium hover:shadow-lg hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.7) 0%, rgba(110, 231, 222, 0.7) 100%)', borderColor: 'rgba(78, 205, 196, 0.4)' }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
