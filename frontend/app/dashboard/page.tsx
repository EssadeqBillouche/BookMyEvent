'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Calendar, User, Mail, Shield } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'admin') {
        // Redirect admins to admin dashboard
        router.push('/admin/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <Navbar />

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative\">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3 text-white drop-shadow-lg">
            Welcome back, {user.firstName}
          </h1>
          <p className="text-lg text-white/70">Manage your events and profile</p>
        </div>

        {/* User Profile Card - Glassmorphism */}
        <div className="glass-card p-8 mb-8 hover:shadow-2xl transition-all duration-300\" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
          <h2 className="text-2xl font-bold mb-6 text-white">Your Profile</h2>
          <div className="flex items-start space-x-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4ecdc4]/40 to-[#6ee7de]/40 rounded-full blur-xl"></div>
              <div
                className="relative w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-lg"
                style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.8) 0%, rgba(110, 231, 222, 0.8) 100%)' }}
              >
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-sm text-white/50">Full Name</p>
                  <p className="text-lg font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-sm text-white/50">Email</p>
                  <p className="text-lg font-semibold text-white">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-sm text-white/50">Role</p>
                  <p className="text-lg font-semibold capitalize text-white">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard
            title="Events Created"
            value={0}
            subtitle="Coming soon"
            icon={<Calendar className="w-6 h-6" />}
            iconBgColor="rgba(29, 48, 63, 0.3)"
            iconColor="#ffffff"
          />

          <StatCard
            title="Attendees"
            value={0}
            subtitle="Coming soon"
            icon={<User className="w-6 h-6" />}
            iconBgColor="rgba(78, 205, 196, 0.25)"
            iconColor="#4ecdc4"
          />

          <StatCard
            title="Upcoming"
            value={0}
            subtitle="Coming soon"
            icon={<Calendar className="w-6 h-6" />}
            iconBgColor="rgba(78, 205, 196, 0.25)"
            iconColor="#4ecdc4"
          />
        </div>
      </main>
    </PageLayout>
  );
}
