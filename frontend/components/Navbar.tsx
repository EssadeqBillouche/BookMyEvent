'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  Welcome, <span className="font-semibold">{user.firstName}</span>
                </span>
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
              <>
                <Link href="/login" className="px-4 py-2 font-medium transition-colors" style={{ color: '#7c90a6' }}>
                  Login
                </Link>
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
