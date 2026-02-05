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
 * 
 * @returns JSX navigation element
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

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
    <nav className="glass-card sticky top-4 mx-4 z-50 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Logo />
          
          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              /* Authenticated User UI */
              <>
                {/* Welcome Message */}
                <span className="text-sm text-white/70">
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
