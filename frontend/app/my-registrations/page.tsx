'use client';

/**
 * My Registrations Page
 *
 * Displays the current user's event registrations with:
 * - Registration status (pending, confirmed, cancelled)
 * - Event details
 * - PDF ticket download for confirmed registrations
 *
 * @module pages/registrations
 * @author EventBook Team
 * @since 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { registrationAPI, ticketAPI, Registration } from '@/lib/api';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  ArrowLeft,
  FileText,
  Loader2,
} from 'lucide-react';

/**
 * Get status badge styling and icon based on registration status
 */
const getStatusConfig = (status: Registration['status']) => {
  const configs = {
    pending: {
      color: 'bg-[var(--warning-muted)] text-[var(--warning)] border-[var(--warning)]/30',
      icon: Clock,
      label: 'Pending Approval',
    },
    confirmed: {
      color: 'bg-[var(--success-muted)] text-[var(--success)] border-[var(--success)]/30',
      icon: CheckCircle,
      label: 'Confirmed',
    },
    cancelled: {
      color: 'bg-[var(--error-muted)] text-[var(--error)] border-[var(--error)]/30',
      icon: XCircle,
      label: 'Cancelled',
    },
    attended: {
      color: 'bg-[var(--info-muted)] text-[var(--info)] border-[var(--info)]/30',
      icon: CheckCircle,
      label: 'Attended',
    },
  };
  return configs[status] || configs.pending;
};

export default function MyRegistrationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State management
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  /**
   * Fetch user's registrations from API
   */
  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await registrationAPI.getMyRegistrations();
      setRegistrations(data);
    } catch {
      setError('Failed to load your registrations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Redirect non-authenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/my-registrations');
    }
  }, [user, authLoading, router]);

  // Fetch registrations when user is authenticated
  useEffect(() => {
    if (user) {
      fetchRegistrations();
    }
  }, [user, fetchRegistrations]);

  /**
   * Handle PDF ticket download
   * Only available for confirmed registrations
   */
  const handleDownloadTicket = async (registrationId: string) => {
    try {
      setDownloadingId(registrationId);
      await ticketAPI.download(registrationId);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Failed to download ticket. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  /**
   * Handle registration cancellation
   * Only available for pending registrations
   */
  const handleCancelRegistration = async (registrationId: string) => {
    if (!confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    try {
      setCancellingId(registrationId);
      await registrationAPI.cancel(registrationId);
      // Refresh the list
      await fetchRegistrations();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Failed to cancel registration. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Format time for display
   */
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show loading spinner while authenticating
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-2">
            My Registrations
          </h1>
          <p className="text-[var(--text-secondary)]">
            View and manage your event registrations. Download tickets for confirmed bookings.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[var(--error-muted)] text-[var(--error)] flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={fetchRegistrations}
              className="ml-auto text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--accent-secondary)]" />
            <p className="text-[var(--text-secondary)] mt-4">Loading your registrations...</p>
          </div>
        ) : registrations.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl">
            <FileText className="w-16 h-16 mx-auto text-[var(--text-tertiary)] mb-4" />
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              No Registrations Yet
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              You haven&apos;t registered for any events yet. Browse our events and find something
              exciting to attend!
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-gray-900 font-medium hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#d4a574' }}
            >
              <Calendar className="w-5 h-5" />
              Browse Events
            </Link>
          </div>
        ) : (
          /* Registrations List */
          <div className="space-y-4">
            {registrations.map((registration) => {
              const statusConfig = getStatusConfig(registration.status);
              const StatusIcon = statusConfig.icon;
              const isConfirmed = registration.status === 'confirmed';
              const isPending = registration.status === 'pending';
              const isDownloading = downloadingId === registration.id;
              const isCancelling = cancellingId === registration.id;

              return (
                <div
                  key={registration.id}
                  className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl overflow-hidden hover:border-[var(--border-strong)] transition-colors"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Event Info */}
                      <div className="flex-1 min-w-0">
                        {/* Status Badge */}
                        <div className="mb-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium border ${statusConfig.color}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                          </span>
                        </div>

                        {/* Event Title */}
                        <Link
                          href={`/events/${registration.event.id}`}
                          className="block group"
                        >
                          <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-secondary)] transition-colors line-clamp-1">
                            {registration.event.title}
                          </h3>
                        </Link>

                        {/* Event Details */}
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                            <Calendar className="w-4 h-4 text-[var(--text-tertiary)]" />
                            <span className="text-sm">{formatDate(registration.event.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                            <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
                            <span className="text-sm">
                              {formatTime(registration.event.startDate)} -{' '}
                              {formatTime(registration.event.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                            <MapPin className="w-4 h-4 text-[var(--text-tertiary)]" />
                            <span className="text-sm line-clamp-1">{registration.event.location}</span>
                          </div>
                        </div>

                        {/* Registration Meta */}
                        <p className="mt-3 text-xs text-[var(--text-tertiary)]">
                          Registered on {formatDate(registration.registeredAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 lg:min-w-[180px]">
                        {/* Download Ticket Button - Only for Confirmed */}
                        {isConfirmed && (
                          <button
                            onClick={() => handleDownloadTicket(registration.id)}
                            disabled={isDownloading}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-gray-900 font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: '#d4a574' }}
                          >
                            {isDownloading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                Download Ticket
                              </>
                            )}
                          </button>
                        )}

                        {/* Pending Status Info */}
                        {isPending && (
                          <div className="text-center px-4 py-2.5 rounded-lg bg-[var(--warning-muted)] text-[var(--warning)]">
                            <p className="text-sm font-medium">Awaiting Approval</p>
                            <p className="text-xs mt-1 opacity-80">
                              Ticket available after confirmation
                            </p>
                          </div>
                        )}

                        {/* View Event Link */}
                        <Link
                          href={`/events/${registration.event.id}`}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border-default)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-hover)] transition-colors"
                        >
                          View Event
                        </Link>

                        {/* Cancel Button - Only for Pending */}
                        {isPending && (
                          <button
                            onClick={() => handleCancelRegistration(registration.id)}
                            disabled={isCancelling}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[var(--error)] hover:bg-[var(--error-muted)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isCancelling ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                Cancel
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </PageLayout>
  );
}
