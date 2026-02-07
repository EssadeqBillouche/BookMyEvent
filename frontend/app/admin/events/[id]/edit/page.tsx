'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { eventAPI, Event, UpdateEventData } from '@/lib/api';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Image as ImageIcon, FileText, Save, Trash2 } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
import AdminRoute from '@/components/auth/AdminRoute';
import Link from 'next/link';

function EditEventContent() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<UpdateEventData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    capacity: 100,
    imageUrl: '',
    price: 0,
    isFeatured: false,
  });

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await eventAPI.getByIdAdmin(eventId);
      setEvent(data);
      setFormData({
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate).toISOString().slice(0, 16),
        endDate: new Date(data.endDate).toISOString().slice(0, 16),
        location: data.location,
        capacity: data.capacity,
        imageUrl: data.imageUrl || '',
        price: data.price,
        isFeatured: data.isFeatured,
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Validate dates
      const start = new Date(formData.startDate!);
      const end = new Date(formData.endDate!);

      if (end <= start) {
        throw new Error('End date must be after start date');
      }

      await eventAPI.update(eventId, formData);
      router.push('/admin/events');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await eventAPI.delete(eventId);
      router.push('/admin/events');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to delete event');
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ecdc4]"></div>
          </div>
        </main>
      </PageLayout>
    );
  }

  if (!event) {
    return (
      <PageLayout>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-white">Event not found</div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Edit Event</h1>
              <p className="text-white/70 mt-2">Update event details</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              event.status === 'published' ? 'bg-[#4ecdc4]/20 text-[#4ecdc4]' :
              event.status === 'draft' ? 'bg-[#ffd93d]/20 text-[#ffd93d]' :
              event.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
              'bg-white/20 text-white/70'
            }`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg glass-card" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="glass-card p-6 rounded-2xl space-y-6" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#4ecdc4]" />
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="glass-card w-full px-4 py-3 rounded-lg outline-none transition-all text-white placeholder-white/40"
                style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
                placeholder="Enter event title"
                required
                minLength={3}
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="glass-card w-full px-4 py-3 rounded-lg outline-none transition-all text-white placeholder-white/40 resize-none"
                style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
                placeholder="Describe your event..."
                required
                minLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                Image URL (Optional)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="glass-card w-full px-4 py-3 rounded-lg outline-none transition-all text-white placeholder-white/40"
                style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="glass-card p-6 rounded-2xl space-y-6" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#4ecdc4]" />
              Date & Time
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="glass-card w-full px-4 py-3 rounded-lg outline-none transition-all text-white"
                  style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="glass-card w-full px-4 py-3 rounded-lg outline-none transition-all text-white"
                  style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Location & Capacity */}
          <div className="glass-card p-6 rounded-2xl space-y-6" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#4ecdc4]" />
              Location & Capacity
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="glass-card w-full px-4 py-3 rounded-lg outline-none transition-all text-white placeholder-white/40"
                style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
                placeholder="Enter venue address or 'Online'"
                required
                maxLength={500}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  <Users className="w-4 h-4 inline mr-1" />
                  Capacity * (1-100,000)
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min={event.registeredCount || 1}
                  max={100000}
                  className="glass-card w-full px-4 py-3 rounded-lg outline-none transition-all text-white"
                  style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
                  required
                />
                <p className="text-white/50 text-xs mt-1">
                  {event.registeredCount > 0 
                    ? `Minimum ${event.registeredCount} (current registrations)` 
                    : 'Maximum number of attendees'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min={0}
                  step={0.01}
                  className="glass-card w-full px-4 py-3 rounded-lg outline-none transition-all text-white"
                  style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
                />
                <p className="text-white/50 text-xs mt-1">Leave as 0 for free events</p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="glass-card p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
            <h2 className="text-xl font-semibold text-white mb-4">Options</h2>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleCheckboxChange}
                className="w-5 h-5 rounded border-2 border-white/30 bg-transparent checked:bg-[#4ecdc4] checked:border-[#4ecdc4] transition-all"
              />
              <span className="text-white">Feature this event on homepage</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="glass-card flex items-center justify-center gap-2 px-6 py-4 text-red-400 rounded-xl transition-all duration-300 font-semibold hover:bg-red-500/10"
              style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <Trash2 className="w-5 h-5" />
              Delete Event
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-white rounded-xl transition-all duration-300 font-semibold hover:scale-105 hover:shadow-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.8) 0%, rgba(110, 231, 222, 0.8) 100%)', borderColor: 'rgba(78, 205, 196, 0.4)' }}
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </PageLayout>
  );
}

export default function EditEventPage() {
  return (
    <AdminRoute>
      <EditEventContent />
    </AdminRoute>
  );
}
