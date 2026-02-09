'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { eventAPI, Event } from '@/lib/api';
import { Plus, Edit2, Trash2, Eye, Calendar, Users, MapPin, DollarSign, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
import AdminRoute from '@/components/auth/AdminRoute';
import Link from 'next/link';

function AdminEventsContent() {
  const { } = useAuth();
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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await eventAPI.publish(id);
      fetchEvents();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to publish event');
    }
    setActionMenuOpen(null);
  };

  const handleCancel = async (id: string) => {
    try {
      await eventAPI.cancel(id);
      fetchEvents();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to cancel event');
    }
    setActionMenuOpen(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventAPI.delete(id);
      fetchEvents();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to delete event');
    }
    setActionMenuOpen(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-[var(--success-muted)] text-[var(--success)] border-[var(--success)]/30';
      case 'draft':
        return 'bg-[var(--warning-muted)] text-[var(--warning)] border-[var(--warning)]/30';
      case 'cancelled':
        return 'bg-[var(--error-muted)] text-[var(--error)] border-[var(--error)]/30';
      case 'completed':
        return 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-default)]';
      default:
        return 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]';
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
          <div className="text-center text-[var(--text-secondary)]">Loading events...</div>
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
            <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-2">Event Management</h1>
            <p className="text-[var(--text-secondary)]">Create and manage events for your platform</p>
          </div>
          <Link
            href="/admin/events/create"
            className="flex items-center space-x-2 px-6 py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] rounded-lg transition-all duration-300 font-medium hover:bg-[var(--accent-primary-hover)] hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[var(--error-muted)] border border-[var(--error)]/40">
            <p className="text-[var(--error)]">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] p-4 rounded-xl">
            <p className="text-[var(--text-secondary)] text-sm">Total Events</p>
            <p className="text-3xl font-semibold text-[var(--text-primary)]">{events.length}</p>
          </div>
          <div className="bg-[var(--success-muted)] border border-[var(--success)]/30 p-4 rounded-xl">
            <p className="text-[var(--success)] text-sm">Published</p>
            <p className="text-3xl font-semibold text-[var(--text-primary)]">{events.filter(e => e.status === 'published').length}</p>
          </div>
          <div className="bg-[var(--warning-muted)] border border-[var(--warning)]/30 p-4 rounded-xl">
            <p className="text-[var(--warning)] text-sm">Drafts</p>
            <p className="text-3xl font-semibold text-[var(--text-primary)]">{events.filter(e => e.status === 'draft').length}</p>
          </div>
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] p-4 rounded-xl">
            <p className="text-[var(--text-secondary)] text-sm">Cancelled</p>
            <p className="text-3xl font-semibold text-[var(--text-primary)]">{events.filter(e => e.status === 'cancelled').length}</p>
          </div>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] p-12 rounded-xl text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Events Yet</h3>
            <p className="text-[var(--text-secondary)] mb-6">Create your first event to get started</p>
            <Link
              href="/admin/events/create"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--accent-primary)] text-[var(--text-inverse)] rounded-lg font-medium hover:bg-[var(--accent-primary-hover)]"
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
                className="bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 rounded-xl transition-all duration-300 hover:border-[var(--border-strong)]"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                      {event.isFeatured && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-primary-muted)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
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
                      className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
                      title="View"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Link>
                    
                    {/* More Actions Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === event.id ? null : event.id)}
                        className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {actionMenuOpen === event.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg overflow-hidden z-50 shadow-[var(--shadow-lg)]">
                          {event.status === 'draft' && (
                            <button
                              onClick={() => handlePublish(event.id)}
                              className="w-full px-4 py-3 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] flex items-center gap-2 transition-all"
                            >
                              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                              Publish Event
                            </button>
                          )}
                          {(event.status === 'published' || event.status === 'draft') && (
                            <button
                              onClick={() => handleCancel(event.id)}
                              className="w-full px-4 py-3 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] flex items-center gap-2 transition-all"
                            >
                              <XCircle className="w-4 h-4 text-[var(--warning)]" />
                              Cancel Event
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="w-full px-4 py-3 text-left text-sm text-[var(--error)] hover:bg-[var(--error-muted)] flex items-center gap-2 transition-all"
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
