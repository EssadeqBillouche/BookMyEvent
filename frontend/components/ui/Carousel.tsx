/**
 * Carousel Component
 * 
 * Premium, responsive carousel with touch support and elegant styling.
 * Part of the EventBook design system.
 * 
 * @component
 */

'use client';

import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousel } from '@/hooks/useCarousel';

interface CarouselSlide {
  id: string | number;
  content: ReactNode;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

/**
 * Carousel Component
 * 
 * Elegant, touch-friendly carousel with smooth animations.
 * 
 * @example
 * ```tsx
 * <Carousel
 *   slides={[
 *     { id: 1, content: <HeroSlide1 /> },
 *     { id: 2, content: <HeroSlide2 /> },
 *   ]}
 *   autoPlay
 *   showDots
 * />
 * ```
 */
export default function Carousel({
  slides,
  autoPlay = true,
  autoPlayInterval = 6000,
  showArrows = true,
  showDots = true,
  className = '',
}: CarouselProps) {
  const {
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    touchHandlers,
    pause,
    resume,
  } = useCarousel({
    totalSlides: slides.length,
    autoPlay,
    autoPlayInterval,
    loop: true,
  });

  if (slides.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      {...touchHandlers}
    >
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="w-full flex-shrink-0"
          >
            {slide.content}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="
              absolute left-4 top-1/2 -translate-y-1/2
              w-10 h-10 md:w-12 md:h-12
              rounded-full
              bg-[var(--bg-elevated)]/90 backdrop-blur-sm
              border border-[var(--border-default)]
              flex items-center justify-center
              text-[var(--text-secondary)]
              hover:text-[var(--text-primary)]
              hover:bg-[var(--bg-elevated)]
              hover:border-[var(--border-strong)]
              hover:scale-105
              active:scale-95
              transition-all duration-200
              shadow-[var(--shadow-md)]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]
              z-10
            "
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="
              absolute right-4 top-1/2 -translate-y-1/2
              w-10 h-10 md:w-12 md:h-12
              rounded-full
              bg-[var(--bg-elevated)]/90 backdrop-blur-sm
              border border-[var(--border-default)]
              flex items-center justify-center
              text-[var(--text-secondary)]
              hover:text-[var(--text-primary)]
              hover:bg-[var(--bg-elevated)]
              hover:border-[var(--border-strong)]
              hover:scale-105
              active:scale-95
              transition-all duration-200
              shadow-[var(--shadow-md)]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]
              z-10
            "
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`
                h-2 rounded-full
                transition-all duration-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]
                ${currentSlide === index
                  ? 'w-8 bg-[var(--accent-primary)]'
                  : 'w-2 bg-[var(--text-tertiary)]/50 hover:bg-[var(--text-tertiary)]'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentSlide === index ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Hero Carousel Slide Component
 * 
 * Pre-styled slide for hero sections with image background.
 */
interface HeroSlideProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
  gradient?: string;
  children?: ReactNode;
}

export function HeroSlide({
  title,
  subtitle,
  imageUrl,
  gradient = 'from-[var(--bg-secondary)] to-[var(--bg-tertiary)]',
  children,
}: HeroSlideProps) {
  return (
    <div className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center">
      {/* Background */}
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-[var(--bg-primary)]/60 backdrop-blur-sm" />
        </div>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--text-primary)] mb-4 leading-tight tracking-tight">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 leading-relaxed">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
