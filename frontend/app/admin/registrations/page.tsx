'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
import { CheckCircle, XCircle, Clock, Calendar, User, Mail, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Registration {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
  notes: string;
  registeredAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  event: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
  };
}

export default function AdminRegistrationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('pending');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchRegistrations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filter]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError('');
      const endpoint = filter === 'pending' 
        ? '/registrations/pending/all'
        : '/registrations';
      const response = await api.get(endpoint);
      
      let data = response.data;
      if (filter !== 'pending' && filter !== 'all') {
        data = data.filter((reg: Registration) => reg.status === filter);
      }
      
      setRegistrations(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id: string) => {
    try {
      setProcessingId(id);
      await api.patch(`/registrations/${id}/validate`);
      await fetchRegistrations();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Failed to validate registration');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefuse = async (id: string) => {
    if (!confirm('Are you sure you want to refuse this registration?')) return;
    
    try {
      setProcessingId(id);
      await api.patch(`/registrations/${id}/refuse`);
      await fetchRegistrations();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Failed to refuse registration');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'bg-[var(--warning-muted)] text-[var(--warning)] border-[var(--warning)]/30', icon: Clock },
      confirmed: { color: 'bg-[var(--success-muted)] text-[var(--success)] border-[var(--success)]/30', icon: CheckCircle },
      cancelled: { color: 'bg-[var(--error-muted)] text-[var(--error)] border-[var(--error)]/30', icon: XCircle },
      attended: { color: 'bg-[var(--info-muted)] text-[var(--info)] border-[var(--info)]/30', icon: CheckCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium border ${badge.color}`}>
        <Icon className="w-4 h-4" />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <PageLayout>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--accent-secondary)]" />
          <p className="text-[var(--text-secondary)] mt-4">Loading registrations...</p>
        </div>
      </PageLayout>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <PageLayout>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-2">Manage Registrations</h1>
          <p className="text-[var(--text-secondary)]">Validate or refuse pending event registrations</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {(['pending', 'all', 'confirmed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                filter === tab
                  ? 'bg-[var(--accent-secondary)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-[var(--error-muted)] border border-[var(--error)]/30 p-4 rounded-lg mb-6">
            <p className="text-[var(--error)]">{error}</p>
          </div>
        )}

        {/* Registrations List */}
        {registrations.length === 0 ? (
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] p-12 rounded-xl text-center">
            <Clock className="w-16 h-16 mx-auto text-[var(--text-tertiary)] mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Registrations Found</h3>
            <p className="text-[var(--text-secondary)]">There are no {filter !== 'all' ? filter : ''} registrations at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration) => (
              <div
                key={registration.id}
                className="bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 rounded-xl hover:border-[var(--border-strong)] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Registration Info */}
                  <div className="flex-1 space-y-3">
                    {/* Status */}
                    <div>{getStatusBadge(registration.status)}</div>
                    
                    {/* Event */}
                    <div className="flex items-center space-x-2 text-[var(--text-primary)]">
                      <Calendar className="w-5 h-5 text-[var(--accent-secondary)]" />
                      <span className="font-medium">{registration.event.title}</span>
                    </div>

                    {/* User */}
                    <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
                      <User className="w-4 h-4 text-[var(--text-tertiary)]" />
                      <span>{registration.user.firstName} {registration.user.lastName}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-[var(--text-tertiary)] text-sm">
                      <Mail className="w-4 h-4" />
                      <span>{registration.user.email}</span>
                    </div>

                    {/* Date */}
                    <div className="text-[var(--text-tertiary)] text-sm">
                      Registered: {new Date(registration.registeredAt).toLocaleDateString()} at {new Date(registration.registeredAt).toLocaleTimeString()}
                    </div>

                    {/* Notes */}
                    {registration.notes && (
                      <div className="bg-[var(--bg-tertiary)] p-3 rounded-lg mt-2">
                        <p className="text-[var(--text-secondary)] text-sm"><strong>Notes:</strong> {registration.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {registration.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleValidate(registration.id)}
                        disabled={processingId === registration.id}
                        className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--success)] text-[var(--text-inverse)]"
                      >
                        {processingId === registration.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Validate</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleRefuse(registration.id)}
                        disabled={processingId === registration.id}
                        className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--error-muted)] border border-[var(--error)]/40 text-[var(--error)]"
                      >
                        {processingId === registration.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="w-5 h-5" />
                            <span>Refuse</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </PageLayout>
  );
}
