'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { user } = useAuth();

  return (
    <PageLayout>
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#e0f2fe', color: '#003580' }}>
            <Sparkles className="w-4 h-4" />
            <span>The Future of Event Management</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            Organize Events
            <br />
            <span style={{ background: 'linear-gradient(to right, #003580, #009fe3, #feba02)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Effortlessly
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create, manage, and attend events with ease. Join thousands of event
            organizers and participants making memorable experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            {user ? (
              <Link
                href="/dashboard"
                className="group flex items-center space-x-2 px-8 py-4 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg"
                style={{ background: 'linear-gradient(to right, #003580, #009fe3)' }}
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="group flex items-center space-x-2 px-8 py-4 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg"
                  style={{ background: 'linear-gradient(to right, #003580, #009fe3)' }}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 border-2 rounded-xl transition-all duration-200 font-semibold text-lg"
                  style={{ borderColor: '#7c90a6', color: '#003580' }}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(to bottom right, #003580, #0047a3)' }}>
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Easy Event Creation
            </h3>
            <p style={{ color: '#7c90a6' }}>
              Create and manage events in minutes with our intuitive interface
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(to bottom right, #009fe3, #00b8f5)' }}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Attendee Management
            </h3>
            <p style={{ color: '#7c90a6' }}>
              Track registrations and manage participants effortlessly
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(to bottom right, #feba02, #ffca3a)' }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Smart Analytics
            </h3>
            <p style={{ color: '#7c90a6' }}>
              Get insights and analytics to make your events more successful
            </p>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
