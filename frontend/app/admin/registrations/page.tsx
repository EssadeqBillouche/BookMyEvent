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
      pending: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: Clock },
      confirmed: { color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: CheckCircle },
      cancelled: { color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: XCircle },
      attended: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: CheckCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-semibold border ${badge.color}`}>
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
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#4ecdc4]" />
          <p className="text-white/70 mt-4">Loading registrations...</p>
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
          <h1 className="text-4xl font-bold text-white mb-2">Manage Registrations</h1>
          <p className="text-white/70">Validate or refuse pending event registrations</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {(['pending', 'all', 'confirmed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                filter === tab
                  ? 'bg-[#4ecdc4] text-white'
                  : 'glass-card text-white/70 hover:text-white hover:bg-white/10'
              }`}
              style={filter !== tab ? { background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' } : {}}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-card p-4 rounded-xl mb-6" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Registrations List */}
        {registrations.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center" style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Clock className="w-16 h-16 mx-auto text-white/30 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Registrations Found</h3>
            <p className="text-white/60">There are no {filter !== 'all' ? filter : ''} registrations at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration) => (
              <div
                key={registration.id}
                className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all"
                style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Registration Info */}
                  <div className="flex-1 space-y-3">
                    {/* Status */}
                    <div>{getStatusBadge(registration.status)}</div>
                    
                    {/* Event */}
                    <div className="flex items-center space-x-2 text-white">
                      <Calendar className="w-5 h-5 text-[#4ecdc4]" />
                      <span className="font-semibold">{registration.event.title}</span>
                    </div>

                    {/* User */}
                    <div className="flex items-center space-x-2 text-white/80">
                      <User className="w-4 h-4 text-white/50" />
                      <span>{registration.user.firstName} {registration.user.lastName}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-white/60 text-sm">
                      <Mail className="w-4 h-4" />
                      <span>{registration.user.email}</span>
                    </div>

                    {/* Date */}
                    <div className="text-white/50 text-sm">
                      Registered: {new Date(registration.registeredAt).toLocaleDateString()} at {new Date(registration.registeredAt).toLocaleTimeString()}
                    </div>

                    {/* Notes */}
                    {registration.notes && (
                      <div className="glass-card p-3 rounded-lg mt-2" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                        <p className="text-white/70 text-sm"><strong>Notes:</strong> {registration.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {registration.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleValidate(registration.id)}
                        disabled={processingId === registration.id}
                        className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(74, 222, 128, 0.8) 100%)', color: 'white' }}
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
                        className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}
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
