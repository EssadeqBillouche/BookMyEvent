'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { eventAPI, CreateEventData } from '@/lib/api';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Image as ImageIcon, FileText, Save, Eye } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
import AdminRoute from '@/components/auth/AdminRoute';
import Link from 'next/link';

function CreateEventContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    capacity: 100,
    status: 'draft',
    imageUrl: '',
    price: 0,
    isFeatured: false,
  });

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

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate dates
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const now = new Date();

      if (start < now) {
        throw new Error('Start date must be in the future');
      }

      if (end <= start) {
        throw new Error('End date must be after start date');
      }

      const eventData: CreateEventData = {
        ...formData,
        status: publish ? 'published' : 'draft',
      };

      await eventAPI.create(eventData);
      router.push('/admin/events');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date/time (now + 1 hour)
  const minDateTime = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

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
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">Create New Event</h1>
          <p className="text-[var(--text-secondary)] mt-2">Fill in the details to create a new event</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[var(--error-muted)] border border-[var(--error)]/40">
            <p className="text-[var(--error)]">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
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
                className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent-primary)]"
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
                className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent-primary)] resize-none"
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
                className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent-primary)]"
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
                  min={minDateTime}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] focus:border-[var(--accent-primary)]"
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
                  min={formData.startDate || minDateTime}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] focus:border-[var(--accent-primary)]"
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
                className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent-primary)]"
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
                  min={1}
                  max={100000}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] focus:border-[var(--accent-primary)]"
                  required
                />
                <p className="text-[var(--text-tertiary)] text-xs mt-1">Maximum number of attendees</p>
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
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] focus:border-[var(--accent-primary)]"
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
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg transition-all duration-300 font-semibold hover:bg-[var(--bg-hover)]"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>
            
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-[var(--text-inverse)] bg-[var(--accent-primary)] rounded-lg transition-all duration-300 font-semibold hover:bg-[var(--accent-primary-hover)]"
            >
              <Eye className="w-5 h-5" />
              {loading ? 'Publishing...' : 'Save & Publish'}
            </button>
          </div>
        </form>
      </main>
    </PageLayout>
  );
}

export default function CreateEventPage() {
  return (
    <AdminRoute>
      <CreateEventContent />
    </AdminRoute>
  );
}
