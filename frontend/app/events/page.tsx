'use client';

import { useState, useEffect } from 'react';
import { eventAPI, Event } from '@/lib/api';
import { Calendar, MapPin, Users, Search, Filter, DollarSign, Star } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
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
  }, [events, searchTerm, priceFilter, sortBy]);

  const fetchEvents = async () => {
    try {
      const data = await eventAPI.getAll();
      setEvents(data);
    } catch (err: any) {
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
    if (percentFilled >= 90) return 'text-red-400';
    if (percentFilled >= 70) return 'text-yellow-400';
    return 'text-green-400';
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
          <h1 className="text-5xl font-bold text-white mb-4">
            Discover <span className="text-[#4ecdc4]">Events</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Find and register for amazing events happening near you
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 mb-8" style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.15)' }}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]/50 focus:border-[#4ecdc4]"
              />
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-white/50" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as 'all' | 'free' | 'paid')}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]/50"
              >
                <option value="all" className="bg-[#1d303f]">All Events</option>
                <option value="free" className="bg-[#1d303f]">Free Events</option>
                <option value="paid" className="bg-[#1d303f]">Paid Events</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'popularity')}
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]/50"
            >
              <option value="date" className="bg-[#1d303f]">Sort by Date</option>
              <option value="price" className="bg-[#1d303f]">Sort by Price</option>
              <option value="popularity" className="bg-[#1d303f]">Sort by Popularity</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Events Grid */}
        {filteredEvents.length === 0 && !error ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
            <p className="text-white/60">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group"
              >
                <div
                  className="glass-card overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col"
                  style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#4ecdc4]/30 to-[#6ee7de]/30 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {event.isFeatured && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-[#ffd93d]/90 text-black text-sm font-semibold">
                        <Star className="w-4 h-4" />
                        Featured
                      </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-semibold">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#4ecdc4] transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <p className="text-white/60 text-sm mb-4 line-clamp-2 flex-1">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-white/70">
                        <Calendar className="w-4 h-4 text-[#4ecdc4]" />
                        <span>{formatDate(event.startDate)} at {formatTime(event.startDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-white/70">
                        <MapPin className="w-4 h-4 text-[#4ecdc4]" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#4ecdc4]" />
                        <span className={getAvailabilityColor(event)}>
                          {getAvailabilityText(event)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-white/50 mb-1">
                        <span>{event.registeredCount} registered</span>
                        <span>{event.capacity} capacity</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%`,
                            background: 'linear-gradient(90deg, #4ecdc4 0%, #6ee7de 100%)',
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
          <div className="text-center mt-8 text-white/50">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        )}
      </main>
    </PageLayout>
  );
}
