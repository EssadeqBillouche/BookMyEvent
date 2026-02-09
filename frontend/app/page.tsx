'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  Github, 
  Twitter, 
  Linkedin,
  Zap,
  Shield,
  BarChart3,
  Globe,
  Heart,
  Play
} from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Navbar from '@/components/Navbar';
import Carousel, { HeroSlide } from '@/components/ui/Carousel';
import Button from '@/components/ui/Button';

export default function Home() {
  const { user } = useAuth();

  // Hero carousel slides
  const heroSlides = [
    {
      id: 1,
      content: (
        <div className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-tertiary)]">
            {/* Decorative elements */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-[var(--accent-primary)]/10 rounded-full blur-3xl animate-pulse-soft" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--accent-secondary)]/10 rounded-full blur-3xl animate-float" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--accent-primary-muted)] text-[var(--accent-primary)] rounded-md text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                <span>The modern way to organize events</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.1] text-[var(--text-primary)] mb-6 tracking-tight animate-fade-in-up">
                Create events that
                <br />
                <span className="text-gradient-gold">people remember</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-xl leading-relaxed animate-fade-in-up stagger-1">
                The simplest way to create, manage, and grow your events. 
                Built for organizers who value clarity and efficiency.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-2">
                {user ? (
                  <Link href="/dashboard">
                    <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
                        Get Started — it&apos;s free
                      </Button>
                    </Link>
                    <Link href="/events">
                      <Button variant="outline" size="lg">
                        Browse Events
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 via-[var(--bg-primary)] to-[var(--accent-secondary)]/5">
            <div className="absolute top-10 left-10 w-64 h-64 bg-[var(--accent-secondary)]/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--accent-primary)]/10 rounded-full blur-3xl animate-pulse-soft" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--accent-secondary-muted)] text-[var(--accent-secondary)] rounded-md text-sm font-medium mb-6">
                  <BarChart3 className="w-4 h-4" />
                  <span>Smart Analytics</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--text-primary)] mb-6 tracking-tight">
                  Data-driven insights for smarter events
                </h2>
                
                <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
                  Track registrations, analyze attendance patterns, and optimize your events with real-time analytics and beautiful dashboards.
                </p>
                
                <Link href="/register">
                  <Button variant="secondary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
                    Start tracking
                  </Button>
                </Link>
              </div>
              
              {/* Stats Preview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 shadow-[var(--shadow-md)]">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary-muted)] flex items-center justify-center mb-4">
                    <Users className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <p className="text-3xl font-semibold text-[var(--text-primary)] mb-1">500K+</p>
                  <p className="text-sm text-[var(--text-tertiary)]">Attendees tracked</p>
                </div>
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 shadow-[var(--shadow-md)]">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-secondary-muted)] flex items-center justify-center mb-4">
                    <Calendar className="w-5 h-5 text-[var(--accent-secondary)]" />
                  </div>
                  <p className="text-3xl font-semibold text-[var(--text-primary)] mb-1">10K+</p>
                  <p className="text-sm text-[var(--text-tertiary)]">Events hosted</p>
                </div>
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 shadow-[var(--shadow-md)]">
                  <div className="w-10 h-10 rounded-lg bg-[var(--success-muted)] flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5 text-[var(--success)]" />
                  </div>
                  <p className="text-3xl font-semibold text-[var(--text-primary)] mb-1">99%</p>
                  <p className="text-sm text-[var(--text-tertiary)]">Uptime</p>
                </div>
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 shadow-[var(--shadow-md)]">
                  <div className="w-10 h-10 rounded-lg bg-[var(--info-muted)] flex items-center justify-center mb-4">
                    <Globe className="w-5 h-5 text-[var(--info)]" />
                  </div>
                  <p className="text-3xl font-semibold text-[var(--text-primary)] mb-1">120+</p>
                  <p className="text-sm text-[var(--text-tertiary)]">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-[var(--bg-tertiary)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent opacity-50" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--accent-primary-muted)] text-[var(--accent-primary)] rounded-md text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>Enterprise Ready</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--text-primary)] mb-6 tracking-tight max-w-3xl mx-auto">
              Trusted by teams of all sizes
            </h2>
            
            <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
              From startup meetups to enterprise conferences, eventbook scales with your needs. 
              Join thousands of organizers who trust us with their most important events.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
                  Start for free
                </Button>
              </Link>
              <Button variant="ghost" size="lg" iconLeft={<Play className="w-4 h-4" />}>
                Watch demo
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <Navbar />

      {/* Hero Carousel Section */}
      <section>
        <Carousel 
          slides={heroSlides} 
          autoPlay 
          autoPlayInterval={7000}
          showArrows 
          showDots 
        />
      </section>

      {/* Stats Row */}
      <section className="py-16 border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Events created' },
              { value: '500K+', label: 'Happy attendees' },
              { value: '99%', label: 'Satisfaction rate' },
              { value: '120+', label: 'Countries' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[var(--text-tertiary)] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-sm font-medium text-[var(--accent-primary)] mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4 tracking-tight">
              Everything you need to succeed
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Powerful tools designed to make event management effortless and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: 'Easy Event Creation',
                description: 'Create and publish events in minutes with our intuitive interface.',
                color: 'accent-primary',
              },
              {
                icon: Users,
                title: 'Attendee Management',
                description: 'Track registrations and manage participants with real-time updates.',
                color: 'accent-secondary',
              },
              {
                icon: BarChart3,
                title: 'Smart Analytics',
                description: 'Get actionable insights to make your events more successful.',
                color: 'success',
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-8 hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] transition-all duration-200 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-[var(--${feature.color}-muted)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className={`w-6 h-6 text-[var(--${feature.color})]`} />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-[var(--accent-primary)] mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4 tracking-tight">
              Three simple steps
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Get started in minutes, not hours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-[var(--border-default)]" />
            
            {[
              { number: '01', title: 'Create Account', description: 'Sign up for free and set up your profile in seconds.' },
              { number: '02', title: 'Create Event', description: 'Add event details, customize your page, and set tickets.' },
              { number: '03', title: 'Go Live', description: 'Publish and share your event with the world.' }
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)] text-[var(--text-inverse)] flex items-center justify-center mx-auto mb-6 text-lg font-semibold shadow-[var(--shadow-glow)]">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{step.title}</h3>
                <p className="text-[var(--text-secondary)]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="py-24 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-[var(--accent-primary)] mb-3">Event Types</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4 tracking-tight">
              Perfect for any event
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              From intimate meetups to large conferences.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Calendar, title: 'Conferences', desc: 'Professional gatherings' },
              { icon: Users, title: 'Meetups', desc: 'Community events' },
              { icon: Star, title: 'Workshops', desc: 'Learning sessions' },
              { icon: Heart, title: 'Social Events', desc: 'Parties & celebrations' },
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 text-center hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] transition-all duration-200 group"
              >
                <item.icon className="w-8 h-8 mx-auto mb-4 text-[var(--accent-primary)] group-hover:scale-110 transition-transform duration-200" />
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">{item.title}</h3>
                <p className="text-[var(--text-tertiary)] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-medium text-[var(--accent-primary)] mb-3">Why eventbook</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-6 tracking-tight">
                Built for organizers who care about details
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-8">
                Every feature is thoughtfully designed to help you create 
                memorable experiences for your attendees.
              </p>

              <div className="space-y-4">
                {[
                  'Easy ticket management and sales',
                  'Secure payment processing',
                  'Real-time analytics dashboard',
                  'Virtual and in-person event support',
                  'Automated reminders and notifications',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--success-muted)] flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--success)]" />
                    </div>
                    <span className="text-[var(--text-primary)]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Cards */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 space-y-4">
              {[
                { name: 'Tech Conference 2026', status: 'Live', statusColor: 'success', location: 'San Francisco', count: '2,500' },
                { name: 'Design Workshop', status: 'Upcoming', statusColor: 'warning', date: 'Feb 15, 2026', count: '150' },
                { name: 'Music Festival', status: 'Sold Out', statusColor: 'accent-primary', location: 'Los Angeles', count: '10,000' },
              ].map((event, index) => (
                <div key={index} className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-4 hover:shadow-[var(--shadow-sm)] transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[var(--text-primary)]">{event.name}</span>
                    <span className={`text-xs font-medium px-2 py-1 bg-[var(--${event.statusColor}-muted)] text-[var(--${event.statusColor})] rounded-md`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[var(--text-tertiary)] text-sm">
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {event.location}
                      </span>
                    )}
                    {event.date && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {event.date}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {event.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[var(--bg-tertiary)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-[var(--accent-primary)] mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4 tracking-tight">
              Loved by organizers
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              See what our community has to say about their experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Johnson', role: 'Event Coordinator', quote: 'Eventbook transformed how we manage our annual conference. The analytics alone saved us countless hours!' },
              { name: 'Michael Chen', role: 'Tech Community Lead', quote: "The easiest platform I've used for organizing meetups. Our community grew 3x since switching!" },
              { name: 'Emily Davis', role: 'Marketing Director', quote: 'Incredible platform! The attendee management features are exactly what we needed for our large-scale events.' },
            ].map((testimonial, index) => (
              <div key={index} className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-8 hover:shadow-[var(--shadow-md)] transition-all duration-200">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--accent-primary)] text-[var(--accent-primary)]" />
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-[var(--text-inverse)] font-medium text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] font-medium">{testimonial.name}</p>
                    <p className="text-[var(--text-tertiary)] text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-2xl p-12 md:p-16 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-secondary)]/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4 tracking-tight">
                Ready to create your event?
              </h2>
              <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto mb-8">
                Join thousands of event organizers who trust eventbook to bring their vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
                    Start for free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] bg-[var(--bg-elevated)]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center">
                  <span className="text-[var(--text-inverse)] font-bold text-sm">E</span>
                </div>
                <span className="text-lg font-semibold text-[var(--text-primary)]">eventbook</span>
              </div>
              <p className="text-[var(--text-tertiary)] mb-6 leading-relaxed text-sm">
                The modern platform for creating, managing, and discovering amazing events.
              </p>
              <div className="flex gap-3">
                {[Twitter, Github, Linkedin].map((Icon, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="w-9 h-9 rounded-lg border border-[var(--border-default)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-[var(--text-primary)] font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Integrations', 'API', 'Documentation'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-sm link-underline">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[var(--text-primary)] font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Blog', 'Press', 'Partners'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-sm link-underline">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[var(--text-primary)] font-semibold mb-4 text-sm">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-[var(--text-tertiary)] text-sm">
                  <Mail className="w-4 h-4" />
                  <span>hello@eventbook.com</span>
                </li>
                <li className="flex items-center gap-2 text-[var(--text-tertiary)] text-sm">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2 text-[var(--text-tertiary)] text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[var(--border-default)] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[var(--text-tertiary)] text-sm">
              © 2026 eventbook. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <a key={item} href="#" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-sm transition-colors link-underline">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </PageLayout>
  );
}
