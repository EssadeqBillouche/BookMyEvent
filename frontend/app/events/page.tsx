'use client';

import { useState, useEffect } from 'react';
import { eventAPI, Event } from '@/lib/api';
import { Calendar, MapPin, Users, Search, Filter, Star } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'popularity'>('date');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, searchTerm, priceFilter, sortBy]);

  const fetchEvents = async () => {
    try {
      const data = await eventAPI.getAll();
      setEvents(data);
    } catch {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortEvents = () => {
    let filtered = [...events];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    if (priceFilter === 'free') {
      filtered = filtered.filter(event => event.price === 0);
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter(event => event.price > 0);
    }

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'popularity') {
      filtered.sort((a, b) => b.registeredCount - a.registeredCount);
    }

    setFilteredEvents(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const getAvailabilityColor = (event: Event) => {
    const percentFilled = (event.registeredCount / event.capacity) * 100;
    if (percentFilled >= 90) return 'text-[var(--error)]';
    if (percentFilled >= 70) return 'text-[var(--warning)]';
    return 'text-[var(--success)]';
  };

  const getAvailabilityText = (event: Event) => {
    const spotsLeft = event.capacity - event.registeredCount;
    if (spotsLeft === 0) return 'Sold Out';
    if (spotsLeft <= 10) return `Only ${spotsLeft} spots left!`;
    return `${spotsLeft} spots available`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageLayout>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--text-primary)] mb-4 tracking-tight">
            Discover <span className="text-[var(--accent-secondary)]">Events</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Find and register for amazing events happening near you
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 mb-8 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary-muted)] focus:border-[var(--accent-primary)] hover:border-[var(--border-strong)] transition-all"
              />
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[var(--text-tertiary)]" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as 'all' | 'free' | 'paid')}
                className="px-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary-muted)] focus:border-[var(--accent-primary)] hover:border-[var(--border-strong)] transition-all cursor-pointer"
              >
                <option value="all">All Events</option>
                <option value="free">Free Events</option>
                <option value="paid">Paid Events</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'popularity')}
              className="px-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary-muted)] focus:border-[var(--accent-primary)] hover:border-[var(--border-strong)] transition-all cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
              <option value="popularity">Sort by Popularity</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center py-8">
            <p className="text-[var(--error)]">{error}</p>
          </div>
        )}

        {/* Events Grid */}
        {filteredEvents.length === 0 && !error ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No events found</h3>
            <p className="text-[var(--text-secondary)]">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group"
              >
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl overflow-hidden hover:shadow-[var(--shadow-lg)] transition-all duration-300 hover:border-[var(--border-strong)] h-full flex flex-col">
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--accent-secondary)]/20 to-[var(--accent-primary)]/20 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-[var(--text-tertiary)]" />
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {event.isFeatured && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full text-gray-900 text-sm font-medium" style={{ backgroundColor: '#d4a574' }}>
                        <Star className="w-4 h-4" />
                        Featured
                      </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[var(--bg-primary)]/90 backdrop-blur-sm text-[var(--text-primary)] text-sm font-semibold border border-[var(--border-default)]">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2 flex-1">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <Calendar className="w-4 h-4 text-[var(--accent-secondary)]" />
                        <span>{formatDate(event.startDate)} at {formatTime(event.startDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <MapPin className="w-4 h-4 text-[var(--accent-secondary)]" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[var(--accent-secondary)]" />
                        <span className={getAvailabilityColor(event)}>
                          {getAvailabilityText(event)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-[var(--text-tertiary)] mb-1">
                        <span>{event.registeredCount} registered</span>
                        <span>{event.capacity} capacity</span>
                      </div>
                      <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)]"
                          style={{
                            width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredEvents.length > 0 && (
          <div className="text-center mt-8 text-[var(--text-tertiary)]">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        )}
      </main>
    </PageLayout>
  );
}
