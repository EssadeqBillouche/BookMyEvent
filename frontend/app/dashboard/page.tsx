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
    if (!loading && !user) {
      router.push('/login');
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-gray-600">Manage your events and profile</p>
        </div>

        {/* User Profile Card */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
          <div className="flex items-start space-x-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(to bottom right, #003580, #009fe3)' }}
            >
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard
            title="Events Created"
            value={0}
            subtitle="Coming soon"
            icon={<Calendar className="w-6 h-6" />}
            iconBgColor="#e0f2fe"
            iconColor="#003580"
          />

          <StatCard
            title="Attendees"
            value={0}
            subtitle="Coming soon"
            icon={<User className="w-6 h-6" />}
            iconBgColor="#dbeafe"
            iconColor="#009fe3"
          />

          <StatCard
            title="Upcoming"
            value={0}
            subtitle="Coming soon"
            icon={<Calendar className="w-6 h-6" />}
            iconBgColor="#fef3c7"
            iconColor="#feba02"
          />
        </div>
      </main>
    </PageLayout>
  );
}
