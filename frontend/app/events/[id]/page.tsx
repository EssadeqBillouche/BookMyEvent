'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { eventAPI, registrationAPI, Event } from '@/lib/api';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Heart,
  CheckCircle,
  XCircle,
  AlertCircle,
  User as UserIcon,
  Star
} from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
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
  }, [eventId]);

  useEffect(() => {
    if (user && eventId && !authLoading) {
      checkRegistration();
    }
  }, [user, eventId, authLoading]);

  const fetchEvent = async () => {
    try {
      const data = await eventAPI.getById(eventId);
      setEvent(data);
    } catch (err: any) {
      setError('Event not found');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const { isRegistered: registered } = await registrationAPI.checkRegistration(eventId);
      setIsRegistered(registered);
    } catch (err) {
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
    } catch (err: any) {
      setRegistrationMessage(err.response?.data?.message || 'Failed to register');
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
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">{error || 'Event not found'}</h1>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-[#4ecdc4] hover:underline"
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
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="relative rounded-2xl overflow-hidden">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-[400px] bg-gradient-to-br from-[#4ecdc4]/30 to-[#6ee7de]/30 flex items-center justify-center">
                  <Calendar className="w-24 h-24 text-white/30" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {event.isFeatured && (
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#ffd93d]/90 text-black text-sm font-semibold">
                    <Star className="w-4 h-4" />
                    Featured
                  </div>
                )}
                {isEventPast && (
                  <div className="px-3 py-1.5 rounded-full bg-red-500/90 text-white text-sm font-semibold">
                    Past Event
                  </div>
                )}
              </div>

              {/* Price Badge */}
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-lg font-bold">
                {event.price === 0 ? 'Free' : `$${event.price}`}
              </div>
            </div>

            {/* Event Title & Description */}
            <div className="glass-card p-6" style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.15)' }}>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{event.title}</h1>
              
              {/* Organizer */}
              {event.createdBy && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4ecdc4] to-[#6ee7de] flex items-center justify-center text-white font-bold">
                    {event.createdBy.firstName[0]}{event.createdBy.lastName[0]}
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Organized by</p>
                    <p className="text-white font-semibold">
                      {event.createdBy.firstName} {event.createdBy.lastName}
                    </p>
                  </div>
                </div>
              )}

              <h2 className="text-xl font-semibold text-white mb-3">About this event</h2>
              <p className="text-white/70 whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="glass-card p-6" style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.15)' }}>
              <h2 className="text-xl font-semibold text-white mb-6">Event Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#4ecdc4]/20">
                    <Calendar className="w-6 h-6 text-[#4ecdc4]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Date & Time</p>
                    <p className="text-white font-semibold">{formatDate(event.startDate)}</p>
                    <p className="text-white/70">{formatTime(event.startDate)} - {formatTime(event.endDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#4ecdc4]/20">
                    <Clock className="w-6 h-6 text-[#4ecdc4]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Duration</p>
                    <p className="text-white font-semibold">{getEventDuration(event.startDate, event.endDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#4ecdc4]/20">
                    <MapPin className="w-6 h-6 text-[#4ecdc4]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Location</p>
                    <p className="text-white font-semibold">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#4ecdc4]/20">
                    <Users className="w-6 h-6 text-[#4ecdc4]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Capacity</p>
                    <p className="text-white font-semibold">{event.capacity} attendees</p>
                    <p className="text-white/70">{event.registeredCount} registered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Registration Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="glass-card p-6" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                {/* Price */}
                <div className="text-center mb-6">
                  <p className="text-white/50 text-sm">Price</p>
                  <p className="text-4xl font-bold text-white">
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </p>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">{event.registeredCount} registered</span>
                    <span className="text-white/70">{event.capacity} spots</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%`,
                        background: isEventFull 
                          ? 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)'
                          : 'linear-gradient(90deg, #4ecdc4 0%, #6ee7de 100%)',
                      }}
                    />
                  </div>
                  <p className={`text-sm mt-2 text-center font-medium ${
                    isEventFull ? 'text-red-400' : spotsLeft <= 10 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {isEventFull ? 'Event is full' : `${spotsLeft} spots remaining`}
                  </p>
                </div>

                {/* Registration Status Message */}
                {registrationMessage && (
                  <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 ${
                    registrationMessage.includes('Successfully') 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
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
                    <div className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-green-500/20 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">You're Registered!</span>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block text-center py-3 px-6 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
                    >
                      View My Registrations
                    </Link>
                  </div>
                ) : isEventPast ? (
                  <button
                    disabled
                    className="w-full py-4 px-6 rounded-xl bg-white/10 text-white/50 cursor-not-allowed"
                  >
                    Event has ended
                  </button>
                ) : isEventFull ? (
                  <button
                    disabled
                    className="w-full py-4 px-6 rounded-xl bg-white/10 text-white/50 cursor-not-allowed"
                  >
                    Event is full
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full py-4 px-6 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.9) 0%, rgba(110, 231, 222, 0.9) 100%)',
                    }}
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
                  <p className="text-center text-white/50 text-sm mt-4">
                    Already have an account?{' '}
                    <Link href={`/login?redirect=/events/${eventId}`} className="text-[#4ecdc4] hover:underline">
                      Sign in
                    </Link>
                  </p>
                )}

                {/* Share Buttons */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-white/50 text-sm text-center mb-3">Share this event</p>
                  <div className="flex justify-center gap-3">
                    <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
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
