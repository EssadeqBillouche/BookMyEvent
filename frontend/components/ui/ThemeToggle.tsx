/**
 * Theme Toggle Component
 * 
 * Elegant theme toggle button with smooth icon transition.
 * Part of the EventBook design system.
 * 
 * @component
 */

'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Theme Toggle Button
 * 
 * Animated toggle between dark and light modes.
 * Uses CSS variables for seamless theme integration.
 */
export default function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { toggleTheme, isDark, mounted } = useTheme();

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-[18px] h-[18px]',
    lg: 'w-5 h-5',
  };

  // Render a placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div 
        className={`
          ${sizes[size]}
          rounded-lg 
          bg-[var(--bg-tertiary)] 
          border border-[var(--border-default)]
          ${className}
        `}
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizes[size]}
        relative rounded-lg 
        bg-[var(--bg-tertiary)] 
        border border-[var(--border-default)]
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:bg-[var(--bg-hover)] 
        hover:border-[var(--border-strong)]
        hover:scale-105
        active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]
        group
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Sun Icon - Visible in dark mode */}
      <Sun 
        className={`
          ${iconSizes[size]}
          absolute
          text-[var(--accent-primary)]
          transition-all duration-300 ease-out
          ${isDark 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 rotate-90 scale-0'
          }
          group-hover:text-[var(--accent-primary-hover)]
        `}
      />
      
      {/* Moon Icon - Visible in light mode */}
      <Moon 
        className={`
          ${iconSizes[size]}
          absolute
          text-[var(--accent-primary)]
          transition-all duration-300 ease-out
          ${isDark 
            ? 'opacity-0 -rotate-90 scale-0' 
            : 'opacity-100 rotate-0 scale-100'
          }
          group-hover:text-[var(--accent-primary-hover)]
        `}
      />
    </button>
  );
}
