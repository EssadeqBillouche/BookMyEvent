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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-secondary)]"></div>
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
          <div className="text-center text-[var(--text-primary)]">Event not found</div>
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
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] tracking-tight">Edit Event</h1>
              <p className="text-[var(--text-secondary)] mt-2">Update event details</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              event.status === 'published' ? 'bg-[var(--accent-secondary-muted)] text-[var(--accent-secondary)]' :
              event.status === 'draft' ? 'bg-[var(--warning)]/20 text-[var(--warning)]' :
              event.status === 'cancelled' ? 'bg-[var(--error)]/20 text-[var(--error)]' :
              'bg-[var(--bg-hover)] text-[var(--text-tertiary)]'
            }`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[var(--error-muted)] border border-[var(--error)]/40">
            <p className="text-[var(--error)]">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--accent-secondary)]" />
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-muted)] hover:border-[var(--border-strong)]"
                placeholder="Enter event title"
                required
                minLength={3}
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-muted)] hover:border-[var(--border-strong)] resize-none"
                placeholder="Describe your event..."
                required
                minLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                Image URL (Optional)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-muted)] hover:border-[var(--border-strong)]"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--accent-secondary)]" />
              Date & Time
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-muted)] hover:border-[var(--border-strong)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-muted)] hover:border-[var(--border-strong)]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location & Capacity */}
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--accent-secondary)]" />
              Location & Capacity
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-muted)] hover:border-[var(--border-strong)]"
                placeholder="Enter venue address or 'Online'"
                required
                maxLength={500}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
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
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-muted)] hover:border-[var(--border-strong)]"
                  required
                />
                <p className="text-[var(--text-tertiary)] text-xs mt-1">
                  {event.registeredCount > 0 
                    ? `Minimum ${event.registeredCount} (current registrations)` 
                    : 'Maximum number of attendees'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
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
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-muted)] hover:border-[var(--border-strong)]"
                />
                <p className="text-[var(--text-tertiary)] text-xs mt-1">Leave as 0 for free events</p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Options</h2>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleCheckboxChange}
                className="w-5 h-5 rounded border-2 border-[var(--border-default)] bg-transparent checked:bg-[var(--accent-secondary)] checked:border-[var(--accent-secondary)] transition-all"
              />
              <span className="text-[var(--text-primary)]">Feature this event on homepage</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 px-6 py-4 text-[var(--error)] bg-[var(--bg-elevated)] border border-[var(--error)]/30 rounded-lg transition-all duration-300 font-semibold hover:bg-[var(--error-muted)]"
            >
              <Trash2 className="w-5 h-5" />
              Delete Event
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-gray-900 rounded-lg transition-all duration-300 font-semibold hover:opacity-90"
              style={{ backgroundColor: '#d4a574' }}
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
