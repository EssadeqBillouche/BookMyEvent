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
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
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
                <span className="text-sm text-gray-700">
                  Welcome, <span className="font-semibold">{user.firstName}</span>
                </span>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: '#f3f4f6', color: '#7c90a6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              /* Guest User UI */
              <>
                {/* Login Link */}
                <Link href="/login" className="px-4 py-2 font-medium transition-colors" style={{ color: '#7c90a6' }}>
                  Login
                </Link>
                
                {/* Sign Up Button */}
                <Link
                  href="/register"
                  className="px-6 py-2 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                  style={{ background: 'linear-gradient(to right, #003580, #009fe3)' }}
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
