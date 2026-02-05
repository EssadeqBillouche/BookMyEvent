'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { eventAPI, CreateEventData } from '@/lib/api';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Image, FileText, Save, Eye } from 'lucide-react';
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
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create event');
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
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </Link>
          <h1 className="text-4xl font-bold text-white">Create New Event</h1>
          <p className="text-white/70 mt-2">Fill in the details to create a new event</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg glass-card" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
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
                <Image className="w-4 h-4 inline mr-1" />
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
                  min={minDateTime}
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
                  min={formData.startDate || minDateTime}
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
                  min={1}
                  max={100000}
                  className="glass-card w-full px-4 py-3 rounded-lg outline-none transition-all text-white"
                  style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
                  required
                />
                <p className="text-white/50 text-xs mt-1">Maximum number of attendees</p>
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
              type="submit"
              disabled={loading}
              className="flex-1 glass-card flex items-center justify-center gap-2 px-6 py-4 text-white rounded-xl transition-all duration-300 font-semibold hover:scale-105"
              style={{ background: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>
            
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-white rounded-xl transition-all duration-300 font-semibold hover:scale-105 hover:shadow-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.8) 0%, rgba(110, 231, 222, 0.8) 100%)', borderColor: 'rgba(78, 205, 196, 0.4)' }}
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
