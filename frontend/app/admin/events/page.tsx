'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { eventAPI, Event } from '@/lib/api';
import { Plus, Edit2, Trash2, Eye, Calendar, Users, MapPin, DollarSign, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
import AdminRoute from '@/components/auth/AdminRoute';
import Link from 'next/link';

function AdminEventsContent() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventAPI.getAllAdmin();
      setEvents(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await eventAPI.publish(id);
      fetchEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to publish event');
    }
    setActionMenuOpen(null);
  };

  const handleCancel = async (id: string) => {
    try {
      await eventAPI.cancel(id);
      fetchEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel event');
    }
    setActionMenuOpen(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventAPI.delete(id);
      fetchEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
    setActionMenuOpen(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-[#4ecdc4]/20 text-[#4ecdc4] border-[#4ecdc4]/30';
      case 'draft':
        return 'bg-[#ffd93d]/20 text-[#ffd93d] border-[#ffd93d]/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed':
        return 'bg-white/20 text-white/70 border-white/30';
      default:
        return 'bg-white/10 text-white/60';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-white/60">Loading events...</div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Event Management</h1>
            <p className="text-white/70">Create and manage events for your platform</p>
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg glass-card" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
            <p className="text-white/60 text-sm">Total Events</p>
            <p className="text-3xl font-bold text-white">{events.length}</p>
          </div>
          <div className="glass-card p-4 rounded-xl" style={{ background: 'rgba(78, 205, 196, 0.15)', borderColor: 'rgba(78, 205, 196, 0.3)' }}>
            <p className="text-[#4ecdc4] text-sm">Published</p>
            <p className="text-3xl font-bold text-white">{events.filter(e => e.status === 'published').length}</p>
          </div>
          <div className="glass-card p-4 rounded-xl" style={{ background: 'rgba(255, 217, 61, 0.15)', borderColor: 'rgba(255, 217, 61, 0.3)' }}>
            <p className="text-[#ffd93d] text-sm">Drafts</p>
            <p className="text-3xl font-bold text-white">{events.filter(e => e.status === 'draft').length}</p>
          </div>
          <div className="glass-card p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            <p className="text-white/60 text-sm">Cancelled</p>
            <p className="text-3xl font-bold text-white">{events.filter(e => e.status === 'cancelled').length}</p>
          </div>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
            <Calendar className="w-16 h-16 mx-auto mb-4 text-white/40" />
            <h3 className="text-xl font-semibold text-white mb-2">No Events Yet</h3>
            <p className="text-white/60 mb-6">Create your first event to get started</p>
            <Link
              href="/admin/events/create"
              className="inline-flex items-center space-x-2 px-6 py-3 text-white rounded-xl font-semibold"
              style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.8) 0%, rgba(110, 231, 222, 0.8) 100%)' }}
            >
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="glass-card p-6 rounded-2xl transition-all duration-300 hover:shadow-xl"
                style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                      {event.isFeatured && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#ffd93d]/20 text-[#ffd93d] border border-[#ffd93d]/30">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{event.registeredCount} / {event.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                      title="View"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Link>
                    
                    {/* More Actions Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === event.id ? null : event.id)}
                        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {actionMenuOpen === event.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl overflow-hidden z-50" style={{ background: 'rgba(29, 48, 63, 0.95)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                          {event.status === 'draft' && (
                            <button
                              onClick={() => handlePublish(event.id)}
                              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2 transition-all"
                            >
                              <CheckCircle className="w-4 h-4 text-[#4ecdc4]" />
                              Publish Event
                            </button>
                          )}
                          {(event.status === 'published' || event.status === 'draft') && (
                            <button
                              onClick={() => handleCancel(event.id)}
                              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2 transition-all"
                            >
                              <XCircle className="w-4 h-4 text-[#ffd93d]" />
                              Cancel Event
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Event
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </PageLayout>
  );
}

export default function AdminEventsPage() {
  return (
    <AdminRoute>
      <AdminEventsContent />
    </AdminRoute>
  );
}
