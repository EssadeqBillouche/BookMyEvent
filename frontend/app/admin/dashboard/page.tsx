'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { eventAPI, Event, api } from '@/lib/api';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Eye, 
  Edit2,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Settings,
  Shield,
  ClipboardList
} from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
import AdminRoute from '@/components/auth/AdminRoute';
import Link from 'next/link';

function AdminDashboardContent() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingRegistrations, setPendingRegistrations] = useState(0);
  const [stats, setStats] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    draftEvents: 0,
    cancelledEvents: 0,
    totalCapacity: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDashboardData();
    fetchPendingRegistrations();
  }, []);

  const fetchPendingRegistrations = async () => {
    try {
      const response = await api.get('/registrations/pending/all');
      setPendingRegistrations(response.data.length);
    } catch (error) {
      console.error('Failed to fetch pending registrations:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const data = await eventAPI.getAllAdmin();
      setEvents(data);
      
      // Calculate stats
      const totalEvents = data.length;
      const publishedEvents = data.filter(e => e.status === 'published').length;
      const draftEvents = data.filter(e => e.status === 'draft').length;
      const cancelledEvents = data.filter(e => e.status === 'cancelled').length;
      const totalCapacity = data.reduce((sum, e) => sum + e.capacity, 0);
      const totalRegistrations = data.reduce((sum, e) => sum + e.registeredCount, 0);
      const totalRevenue = data.reduce((sum, e) => sum + (e.price * e.registeredCount), 0);

      setStats({
        totalEvents,
        publishedEvents,
        draftEvents,
        cancelledEvents,
        totalCapacity,
        totalRegistrations,
        totalRevenue,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentEvents = events.slice(0, 5);
  const upcomingEvents = events
    .filter(e => e.status === 'published' && new Date(e.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-[#4ecdc4]" />;
      case 'draft':
        return <FileText className="w-4 h-4 text-[#ffd93d]" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-white/60" />;
    }
  };

  return (
    <PageLayout>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-[#4ecdc4]" />
              <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <p className="text-white/70">Welcome back, {user?.firstName}! Here's your platform overview.</p>
          </div>
          <Link
            href="/admin/events/create"
            className="group glass-card flex items-center space-x-2 px-6 py-3 text-white rounded-xl transition-all duration-300 font-semibold hover:scale-105 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.8) 0%, rgba(110, 231, 222, 0.8) 100%)', borderColor: 'rgba(78, 205, 196, 0.4)' }}
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-8 h-8 text-[#4ecdc4]" />
              <span className="text-xs text-white/50 font-medium">TOTAL</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalEvents}</p>
            <p className="text-sm text-white/60 mt-1">Total Events</p>
          </div>

          <div className="glass-card p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{ background: 'rgba(78, 205, 196, 0.15)', borderColor: 'rgba(78, 205, 196, 0.3)' }}>
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="w-8 h-8 text-[#4ecdc4]" />
              <span className="text-xs text-[#4ecdc4] font-medium">LIVE</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.publishedEvents}</p>
            <p className="text-sm text-white/60 mt-1">Published</p>
          </div>

          <div className="glass-card p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{ background: 'rgba(255, 217, 61, 0.15)', borderColor: 'rgba(255, 217, 61, 0.3)' }}>
            <div className="flex items-center justify-between mb-3">
              <FileText className="w-8 h-8 text-[#ffd93d]" />
              <span className="text-xs text-[#ffd93d] font-medium">PENDING</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.draftEvents}</p>
            <p className="text-sm text-white/60 mt-1">Drafts</p>
          </div>

          <div className="glass-card p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-white/80" />
              <span className="text-xs text-white/50 font-medium">USERS</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalRegistrations}</p>
            <p className="text-sm text-white/60 mt-1">Registrations</p>
          </div>
        </div>

        {/* Pending Registrations Alert */}
        {pendingRegistrations > 0 && (
          <Link href="/admin/registrations">
            <div className="glass-card p-6 rounded-xl mb-8 transition-all duration-300 hover:scale-[1.02] cursor-pointer" 
              style={{ background: 'rgba(255, 217, 61, 0.15)', borderColor: 'rgba(255, 217, 61, 0.4)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#ffd93d]/20">
                    <ClipboardList className="w-8 h-8 text-[#ffd93d]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {pendingRegistrations} Pending Registration{pendingRegistrations !== 1 ? 's' : ''}
                    </h3>
                    <p className="text-white/70">Click to review and approve pending registrations</p>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className="px-4 py-2 rounded-lg font-semibold text-[#ffd93d]" style={{ background: 'rgba(255, 217, 61, 0.2)' }}>
                    Review Now →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Secondary Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-6 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#4ecdc4]/20">
                <TrendingUp className="w-5 h-5 text-[#4ecdc4]" />
              </div>
              <span className="text-white/60 text-sm">Total Capacity</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalCapacity.toLocaleString()}</p>
          </div>

          <div className="glass-card p-6 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#ffd93d]/20">
                <BarChart3 className="w-5 h-5 text-[#ffd93d]" />
              </div>
              <span className="text-white/60 text-sm">Fill Rate</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.totalCapacity > 0 
                ? Math.round((stats.totalRegistrations / stats.totalCapacity) * 100) 
                : 0}%
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/20">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-white/60 text-sm">Potential Revenue</span>
            </div>
            <p className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Events */}
          <div className="glass-card p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Events</h2>
              <Link href="/admin/events" className="text-[#4ecdc4] text-sm hover:underline">
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-8 text-white/60">Loading...</div>
            ) : recentEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-white/30" />
                <p className="text-white/60">No events created yet</p>
                <Link
                  href="/admin/events/create"
                  className="inline-block mt-4 text-[#4ecdc4] hover:underline"
                >
                  Create your first event →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 rounded-xl transition-all hover:bg-white/5"
                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(event.status)}
                      <div>
                        <p className="text-white font-medium">{event.title}</p>
                        <p className="text-white/50 text-sm">{formatDate(event.startDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="glass-card p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
              <Clock className="w-5 h-5 text-white/40" />
            </div>

            {loading ? (
              <div className="text-center py-8 text-white/60">Loading...</div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto mb-3 text-white/30" />
                <p className="text-white/60">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-xl"
                    style={{ background: 'rgba(78, 205, 196, 0.1)', borderColor: 'rgba(78, 205, 196, 0.2)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium">{event.title}</p>
                      <span className="text-[#4ecdc4] text-sm font-medium">
                        {formatDate(event.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">{event.location}</span>
                      <span className="text-white/70">
                        {event.registeredCount}/{event.capacity} registered
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4ecdc4] rounded-full transition-all"
                        style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 glass-card p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.15)' }}>
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/events/create"
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/10 transition-all text-white/80 hover:text-white"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">New Event</span>
            </Link>
            <Link
              href="/admin/events"
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/10 transition-all text-white/80 hover:text-white"
            >
              <Calendar className="w-8 h-8" />
              <span className="text-sm font-medium">All Events</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/10 transition-all text-white/80 hover:text-white"
            >
              <Eye className="w-8 h-8" />
              <span className="text-sm font-medium">View Profile</span>
            </Link>
            <Link
              href="/"
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/10 transition-all text-white/80 hover:text-white"
            >
              <Settings className="w-8 h-8" />
              <span className="text-sm font-medium">View Site</span>
            </Link>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}
