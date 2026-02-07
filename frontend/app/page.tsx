'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, Sparkles, ArrowRight, CheckCircle, Star, MapPin, Clock, Shield, Zap, Heart, Mail, Phone, Github, Twitter, Linkedin } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { user } = useAuth();

  return (
    <PageLayout>
      <Navbar />

      {/* Hero Section - Full Screen */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Hero Image */}
        <div className="absolute inset-0 w-full h-full -z-10">
          <Image
            src="/hero-family-futuristic.jpg"
            alt="Futuristic event dashboard background"
            fill
            className="object-cover object-center animate-subtle-zoom"
            style={{ filter: 'brightness(0.6)' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1d303f]/70 via-[#1d303f]/60 to-[#1d303f]/90" />
          
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4ecdc4]/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6ee7de]/20 rounded-full blur-3xl animate-pulse-slow-delay" />
        </div>

        <div className="relative w-full max-w-5xl mx-auto px-6 text-center space-y-10 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-block">
            
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-extrabold leading-tight text-white drop-shadow-2xl">
            Organize Events
            <br />
            <span className="bg-gradient-to-r from-[#4ecdc4] via-[#6ee7de] to-[#4ecdc4] bg-clip-text text-transparent animate-gradient-shift">
              Effortlessly
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-white/95 font-light">
            Create, manage, and attend events with ease. Join thousands of event
            organizers and participants making <span className="font-semibold text-[#4ecdc4]">memorable experiences</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-8">
            {user ? (
              <Link
                href="/dashboard"
                className="group glass-card flex items-center space-x-3 px-10 py-5 text-white rounded-2xl transition-all duration-300 font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-[#4ecdc4]/30"
                style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.9) 0%, rgba(110, 231, 222, 0.9) 100%)', borderColor: 'rgba(78, 205, 196, 0.5)' }}
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="group glass-card flex items-center space-x-3 px-10 py-5 text-white rounded-2xl transition-all duration-300 font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-[#4ecdc4]/30"
                  style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.9) 0%, rgba(110, 231, 222, 0.9) 100%)', borderColor: 'rgba(78, 205, 196, 0.5)' }}
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link
                  href="/events"
                  className="glass-card px-10 py-5 rounded-2xl transition-all duration-300 font-semibold text-lg hover:shadow-xl text-white hover:scale-105 border-2"
                  style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                >
                  Browse Events
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#4ecdc4] mb-2">10K+</div>
              <div className="text-white/70 text-sm md:text-base">Events Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#4ecdc4] mb-2">500K+</div>
              <div className="text-white/70 text-sm md:text-base">Happy Attendees</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#4ecdc4] mb-2">99%</div>
              <div className="text-white/70 text-sm md:text-base">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-white/60 animate-scroll-indicator" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group glass-card p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6" style={{ background: 'linear-gradient(135deg, rgba(29, 48, 63, 0.9) 0%, rgba(42, 68, 86, 0.9) 100%)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)' }}>
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">
              Easy Event Creation
            </h3>
            <p className="text-white/70 leading-relaxed">
              Create and manage events in minutes with our intuitive interface and powerful tools
            </p>
          </div>

          <div className="group glass-card p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6" style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.8) 0%, rgba(68, 160, 141, 0.8) 100%)', boxShadow: '0 8px 16px rgba(78, 205, 196, 0.3)' }}>
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">
              Attendee Management
            </h3>
            <p className="text-white/70 leading-relaxed">
              Track registrations and manage participants effortlessly with real-time updates
            </p>
          </div>

          <div className="group glass-card p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6" style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.8) 0%, rgba(110, 231, 222, 0.8) 100%)', boxShadow: '0 8px 16px rgba(78, 205, 196, 0.3)' }}>
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">
              Smart Analytics
            </h3>
            <p className="text-white/70 leading-relaxed">
              Get insights and analytics to make your events more successful and engaging
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <section className="mt-32">
          <div className="text-center mb-16">
            <span className="glass-card px-4 py-2 text-sm font-semibold inline-block mb-4" style={{ color: '#4ecdc4', background: 'rgba(78, 205, 196, 0.15)', borderColor: 'rgba(78, 205, 196, 0.3)' }}>
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Three Simple Steps
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Get started with BookMyEvent in just a few minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#4ecdc4]/50 via-[#6ee7de]/50 to-[#4ecdc4]/50"></div>
            
            <div className="text-center relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.8) 0%, rgba(110, 231, 222, 0.8) 100%)', boxShadow: '0 8px 24px rgba(78, 205, 196, 0.4)' }}>
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Create Account</h3>
              <p className="text-white/70">Sign up for free and set up your organizer profile in seconds</p>
            </div>

            <div className="text-center relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.8) 0%, rgba(68, 160, 141, 0.8) 100%)', boxShadow: '0 8px 24px rgba(78, 205, 196, 0.4)' }}>
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Create Event</h3>
              <p className="text-white/70">Add event details, set tickets, and customize your event page</p>
            </div>

            <div className="text-center relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, rgba(255, 217, 61, 0.8) 0%, rgba(255, 193, 7, 0.8) 100%)', boxShadow: '0 8px 24px rgba(255, 217, 61, 0.4)' }}>
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Go Live</h3>
              <p className="text-white/70">Publish and share your event with the world instantly</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-32">
          <div className="glass-card p-12 rounded-3xl" style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #4ecdc4 0%, #6ee7de 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>10K+</div>
                <p className="text-white/70 font-medium">Events Created</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>50K+</div>
                <p className="text-white/70 font-medium">Happy Attendees</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #ffd93d 0%, #ffc107 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>5K+</div>
                <p className="text-white/70 font-medium">Event Organizers</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>99%</div>
                <p className="text-white/70 font-medium">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Event Types Section */}
        <section className="mt-32">
          <div className="text-center mb-16">
            <span className="glass-card px-4 py-2 text-sm font-semibold inline-block mb-4" style={{ color: '#4ecdc4', background: 'rgba(78, 205, 196, 0.15)', borderColor: 'rgba(78, 205, 196, 0.3)' }}>
              Event Types
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Perfect for Any Event
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              From small meetups to large conferences, we&apos;ve got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Calendar, title: 'Conferences', desc: 'Professional gatherings' },
              { icon: Users, title: 'Meetups', desc: 'Community events' },
              { icon: Star, title: 'Workshops', desc: 'Learning sessions' },
              { icon: Heart, title: 'Social Events', desc: 'Parties & celebrations' },
            ].map((item, index) => (
              <div key={index} className="glass-card p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:shadow-xl" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                <item.icon className="w-10 h-10 mx-auto mb-4 text-[#4ecdc4]" />
                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features List Section */}
        <section className="mt-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="glass-card px-4 py-2 text-sm font-semibold inline-block mb-4" style={{ color: '#ffd93d', background: 'rgba(255, 217, 61, 0.15)', borderColor: 'rgba(255, 217, 61, 0.3)' }}>
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Powerful features designed to make your event management experience seamless and enjoyable.
              </p>

              <div className="space-y-4">
                {[
                  { icon: CheckCircle, text: 'Easy ticket management and sales' },
                  { icon: Shield, text: 'Secure payment processing' },
                  { icon: Zap, text: 'Real-time analytics dashboard' },
                  { icon: MapPin, text: 'Virtual and in-person event support' },
                  { icon: Clock, text: 'Automated reminders and notifications' },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(78, 205, 196, 0.2)' }}>
                      <feature.icon className="w-5 h-5 text-[#4ecdc4]" />
                    </div>
                    <span className="text-white/90 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl" style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
              <div className="space-y-6">
                <div className="glass-card p-4 rounded-xl" style={{ background: 'rgba(78, 205, 196, 0.15)', borderColor: 'rgba(78, 205, 196, 0.3)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Tech Conference 2026</span>
                    <span className="text-[#4ecdc4] text-sm font-medium">Live</span>
                  </div>
                  <div className="flex items-center space-x-4 text-white/60 text-sm">
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> San Francisco</span>
                    <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> 2,500 attendees</span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl" style={{ background: 'rgba(78, 205, 196, 0.15)', borderColor: 'rgba(78, 205, 196, 0.3)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Design Workshop</span>
                    <span className="text-[#ffd93d] text-sm font-medium">Upcoming</span>
                  </div>
                  <div className="flex items-center space-x-4 text-white/60 text-sm">
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> Feb 15, 2026</span>
                    <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> 150 registered</span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl" style={{ background: 'rgba(255, 217, 61, 0.15)', borderColor: 'rgba(255, 217, 61, 0.3)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Music Festival</span>
                    <span className="text-[#4ecdc4] text-sm font-medium">Sold Out</span>
                  </div>
                  <div className="flex items-center space-x-4 text-white/60 text-sm">
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> Los Angeles</span>
                    <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> 10,000 attendees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mt-32">
          <div className="text-center mb-16">
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Loved by Organizers
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              See what our community has to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Event Coordinator', quote: 'BookMyEvent transformed how we manage our annual conference. The analytics alone saved us countless hours!' },
              { name: 'Michael Chen', role: 'Tech Community Lead', quote: 'The easiest platform I\'ve used for organizing meetups. Our community grew 3x since switching!' },
              { name: 'Emily Davis', role: 'Marketing Director', quote: 'Incredible platform! The attendee management features are exactly what we needed for our large-scale events.' },
            ].map((testimonial, index) => (
              <div key={index} className="glass-card p-8 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#ffd93d] text-[#ffd93d]" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.8) 0%, rgba(110, 231, 222, 0.8) 100%)' }}>
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-32 mb-16">
          <div className="glass-card p-12 md:p-16 rounded-3xl text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15) 0%, rgba(110, 231, 222, 0.15) 100%)', borderColor: 'rgba(78, 205, 196, 0.3)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4ecdc4]/30 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#6ee7de]/30 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Create Your Event?
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                Join thousands of event organizers who trust BookMyEvent to bring their vision to life. Start for free today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="group glass-card flex items-center justify-center space-x-2 px-8 py-4 text-white rounded-xl transition-all duration-300 font-semibold text-lg hover:scale-105 hover:shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.9) 0%, rgba(110, 231, 222, 0.9) 100%)', borderColor: 'rgba(78, 205, 196, 0.5)' }}
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="glass-card px-8 py-4 rounded-xl transition-all duration-200 font-semibold text-lg hover:shadow-xl text-white hover:scale-105"
                  style={{ background: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold">
                  <span className="text-white">Book</span>
                  <span className="text-[#4ecdc4]">My</span>
                  <span className="text-white">Event</span>
                </span>
              </div>
              <p className="text-white/60 mb-6 leading-relaxed">
                The modern platform for creating, managing, and discovering amazing events.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all" style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all" style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all" style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4">
                {['Features', 'Pricing', 'Integrations', 'API', 'Documentation'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4">
                {['About Us', 'Careers', 'Blog', 'Press', 'Partners'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-white/60">
                  <Mail className="w-5 h-5" />
                  <span>hello@bookmyevent.com</span>
                </li>
                <li className="flex items-center space-x-3 text-white/60">
                  <Phone className="w-5 h-5" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3 text-white/60">
                  <MapPin className="w-5 h-5" />
                  <span>San Francisco, CA</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <p className="text-white/50 text-sm">
              © 2026 BookMyEvent. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </PageLayout>
  );
}
