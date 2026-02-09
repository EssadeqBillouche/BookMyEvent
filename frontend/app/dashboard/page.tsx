'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Calendar, User, Mail, Shield, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
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
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-2">
            Welcome back, {user.firstName}
          </h1>
          <p className="text-[var(--text-secondary)]">Manage your events and profile</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Events Created"
            value={0}
            subtitle="Coming soon"
            icon={<Calendar className="w-5 h-5" />}
          />

          <StatCard
            title="Attendees"
            value={0}
            subtitle="Coming soon"
            icon={<User className="w-5 h-5" />}
          />

          <StatCard
            title="Upcoming Events"
            value={0}
            subtitle="Coming soon"
            icon={<Calendar className="w-5 h-5" />}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* User Profile Card */}
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Your Profile</h2>
            <div className="flex items-start gap-5">
              <div
                className="w-16 h-16 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center text-[var(--text-inverse)] text-xl font-semibold flex-shrink-0"
              >
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[var(--text-tertiary)]" />
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Full Name</p>
                    <p className="font-medium text-[var(--text-primary)]">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[var(--text-tertiary)]" />
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Email</p>
                    <p className="font-medium text-[var(--text-primary)]">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-[var(--text-tertiary)]" />
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Role</p>
                    <p className="font-medium capitalize text-[var(--text-primary)]">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                href="/my-registrations"
                className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[var(--accent-primary)]" />
                  <span className="font-medium text-[var(--text-primary)]">My Registrations</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
              </Link>
              <Link 
                href="/events"
                className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[var(--accent-primary)]" />
                  <span className="font-medium text-[var(--text-primary)]">Browse Events</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
              </Link>
              <Link 
                href="/profile"
                className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[var(--accent-primary)]" />
                  <span className="font-medium text-[var(--text-primary)]">Edit Profile</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
