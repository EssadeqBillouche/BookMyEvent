/**
 * useCarousel Hook
 * 
 * Custom hook for managing carousel state and interactions.
 * Supports auto-play, touch/swipe gestures, and keyboard navigation.
 * Part of the EventBook design system.
 * 
 * @module useCarousel
 */

'use client';

import { useState, useCallback, useEffect, useRef, TouchEvent } from 'react';

interface UseCarouselOptions {
  totalSlides: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
}

interface UseCarouselReturn {
  currentSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  isAnimating: boolean;
  touchHandlers: {
    onTouchStart: (e: TouchEvent) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: () => void;
  };
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
}

/**
 * useCarousel Hook
 * 
 * Provides carousel state management with touch support and auto-play.
 * 
 * @example
 * ```tsx
 * const { currentSlide, nextSlide, prevSlide, touchHandlers } = useCarousel({
 *   totalSlides: 5,
 *   autoPlay: true,
 *   autoPlayInterval: 5000,
 * });
 * ```
 */
export function useCarousel({
  totalSlides,
  autoPlay = false,
  autoPlayInterval = 5000,
  loop = true,
}: UseCarouselOptions): UseCarouselReturn {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Touch gesture tracking
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50;
  
  // Auto-play interval reference
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Navigate to next slide
   */
  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide((prev) => {
      if (prev >= totalSlides - 1) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
    
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, totalSlides, loop]);

  /**
   * Navigate to previous slide
   */
  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide((prev) => {
      if (prev <= 0) {
        return loop ? totalSlides - 1 : prev;
      }
      return prev - 1;
    });
    
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, totalSlides, loop]);

  /**
   * Navigate to specific slide
   */
  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentSlide) return;
    if (index < 0 || index >= totalSlides) return;
    
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, currentSlide, totalSlides]);

  /**
   * Touch handlers for swipe gestures
   */
  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  }, [nextSlide, prevSlide]);

  /**
   * Pause auto-play
   */
  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  /**
   * Resume auto-play
   */
  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  /**
   * Auto-play effect
   */
  useEffect(() => {
    if (!autoPlay || isPaused) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, isPaused, nextSlide]);

  /**
   * Keyboard navigation
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return {
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    isAnimating,
    touchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    pause,
    resume,
    isPaused,
  };
}
