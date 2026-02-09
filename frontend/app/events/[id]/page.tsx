'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { eventAPI, registrationAPI, Event } from '@/lib/api';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Heart,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  useEffect(() => {
    if (user && eventId && !authLoading) {
      checkRegistration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, eventId, authLoading]);

  const fetchEvent = async () => {
    try {
      const data = await eventAPI.getById(eventId);
      setEvent(data);
    } catch {
      setError('Event not found');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const { isRegistered: registered } = await registrationAPI.checkRegistration(eventId);
      setIsRegistered(registered);
    } catch {
      // User might not be authenticated
    }
  };

  const handleRegister = async () => {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    setRegistering(true);
    setRegistrationMessage('');

    try {
      await registrationAPI.register({ eventId });
      setIsRegistered(true);
      setRegistrationMessage('Successfully registered for this event!');
      // Refresh event data to update count
      fetchEvent();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setRegistrationMessage(error.response?.data?.message || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    const days = Math.round(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  const isEventFull = event && event.registeredCount >= event.capacity;
  const isEventPast = event && new Date(event.startDate) < new Date();
  const spotsLeft = event ? event.capacity - event.registeredCount : 0;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !event) {
    return (
      <PageLayout>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-[var(--error)] mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">{error || 'Event not found'}</h1>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-[var(--accent-secondary)] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="relative rounded-xl overflow-hidden h-[400px]">
              {event.imageUrl ? (
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-[400px] bg-gradient-to-br from-[var(--accent-secondary)]/20 to-[var(--accent-primary)]/20 flex items-center justify-center">
                  <Calendar className="w-24 h-24 text-[var(--text-tertiary)]" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {event.isFeatured && (
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--accent-primary)] text-[var(--text-inverse)] text-sm font-medium">
                    <Star className="w-4 h-4" />
                    Featured
                  </div>
                )}
                {isEventPast && (
                  <div className="px-3 py-1.5 rounded-full bg-[var(--error)] text-[var(--text-inverse)] text-sm font-medium">
                    Past Event
                  </div>
                )}
              </div>

              {/* Price Badge */}
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-[var(--bg-primary)]/90 backdrop-blur-sm text-[var(--text-primary)] text-lg font-semibold border border-[var(--border-default)]">
                {event.price === 0 ? 'Free' : `$${event.price}`}
              </div>
            </div>

            {/* Event Title & Description */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-4">{event.title}</h1>
              
              {/* Organizer */}
              {event.createdBy && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--border-default)]">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] flex items-center justify-center text-[var(--text-inverse)] font-semibold">
                    {event.createdBy.firstName[0]}{event.createdBy.lastName[0]}
                  </div>
                  <div>
                    <p className="text-[var(--text-tertiary)] text-sm">Organized by</p>
                    <p className="text-[var(--text-primary)] font-medium">
                      {event.createdBy.firstName} {event.createdBy.lastName}
                    </p>
                  </div>
                </div>
              )}

              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">About this event</h2>
              <p className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Event Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[var(--accent-secondary-muted)]">
                    <Calendar className="w-6 h-6 text-[var(--accent-secondary)]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-tertiary)] text-sm mb-1">Date & Time</p>
                    <p className="text-[var(--text-primary)] font-medium">{formatDate(event.startDate)}</p>
                    <p className="text-[var(--text-secondary)]">{formatTime(event.startDate)} - {formatTime(event.endDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[var(--accent-secondary-muted)]">
                    <Clock className="w-6 h-6 text-[var(--accent-secondary)]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-tertiary)] text-sm mb-1">Duration</p>
                    <p className="text-[var(--text-primary)] font-medium">{getEventDuration(event.startDate, event.endDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[var(--accent-secondary-muted)]">
                    <MapPin className="w-6 h-6 text-[var(--accent-secondary)]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-tertiary)] text-sm mb-1">Location</p>
                    <p className="text-[var(--text-primary)] font-medium">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[var(--accent-secondary-muted)]">
                    <Users className="w-6 h-6 text-[var(--accent-secondary)]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-tertiary)] text-sm mb-1">Capacity</p>
                    <p className="text-[var(--text-primary)] font-medium">{event.capacity} attendees</p>
                    <p className="text-[var(--text-secondary)]">{event.registeredCount} registered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Registration Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 shadow-[var(--shadow-md)]">
                {/* Price */}
                <div className="text-center mb-6">
                  <p className="text-[var(--text-tertiary)] text-sm">Price</p>
                  <p className="text-4xl font-semibold text-[var(--text-primary)]">
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </p>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--text-secondary)]">{event.registeredCount} registered</span>
                    <span className="text-[var(--text-secondary)]">{event.capacity} spots</span>
                  </div>
                  <div className="h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isEventFull 
                          ? 'bg-[var(--error)]'
                          : 'bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)]'
                      }`}
                      style={{
                        width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <p className={`text-sm mt-2 text-center font-medium ${
                    isEventFull ? 'text-[var(--error)]' : spotsLeft <= 10 ? 'text-[var(--warning)]' : 'text-[var(--success)]'
                  }`}>
                    {isEventFull ? 'Event is full' : `${spotsLeft} spots remaining`}
                  </p>
                </div>

                {/* Registration Status Message */}
                {registrationMessage && (
                  <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                    registrationMessage.includes('Successfully') 
                      ? 'bg-[var(--success-muted)] text-[var(--success)]' 
                      : 'bg-[var(--error-muted)] text-[var(--error)]'
                  }`}>
                    {registrationMessage.includes('Successfully') ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm">{registrationMessage}</span>
                  </div>
                )}

                {/* Registration Button */}
                {isRegistered ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 py-4 px-6 rounded-lg bg-[var(--success-muted)] text-[var(--success)]">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">You&apos;re Registered!</span>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block text-center py-3 px-6 rounded-lg border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      View My Registrations
                    </Link>
                  </div>
                ) : isEventPast ? (
                  <button
                    disabled
                    className="w-full py-4 px-6 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed"
                  >
                    Event has ended
                  </button>
                ) : isEventFull ? (
                  <button
                    disabled
                    className="w-full py-4 px-6 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed"
                  >
                    Event is full
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full py-4 px-6 rounded-lg bg-[var(--accent-primary)] text-[var(--text-inverse)] font-medium transition-all duration-300 hover:bg-[var(--accent-primary-hover)] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registering ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Registering...
                      </span>
                    ) : user ? (
                      'Register Now'
                    ) : (
                      'Login to Register'
                    )}
                  </button>
                )}

                {/* Login Prompt */}
                {!user && !authLoading && (
                  <p className="text-center text-[var(--text-tertiary)] text-sm mt-4">
                    Already have an account?{' '}
                    <Link href={`/login?redirect=/events/${eventId}`} className="text-[var(--accent-secondary)] hover:underline">
                      Sign in
                    </Link>
                  </p>
                )}

                {/* Share Buttons */}
                <div className="mt-6 pt-6 border-t border-[var(--border-default)]">
                  <p className="text-[var(--text-tertiary)] text-sm text-center mb-3">Share this event</p>
                  <div className="flex justify-center gap-3">
                    <button className="p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
