/**
 * Button Component
 * 
 * Premium button with elegant styling and subtle interactions.
 * Supports dark/light themes via CSS variables.
 * Part of the EventBook design system.
 * 
 * @component
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Button Props Interface
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

/**
 * Button Component
 * 
 * Elegant, minimal button with multiple variants.
 * All colors use CSS variables for seamless theme switching.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg">
 *   Get Started
 * </Button>
 * ```
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading, 
  disabled, 
  fullWidth = false,
  iconLeft,
  iconRight,
  className = '', 
  ...props 
}: ButtonProps) {
  // Size configurations with refined spacing
  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  // Base styles - clean and minimal with smooth transitions
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium tracking-tight
    rounded-lg
    transition-all duration-200 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]
    active:scale-[0.98]
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
  `;

  /**
   * Variant styles using CSS variables
   * Each variant has a distinct visual identity
   */
  const variantStyles = {
    // Primary - Gold accent (main CTA)
    primary: `
      text-gray-900
      hover:opacity-90
      focus-visible:ring-amber-500
      shadow-sm hover:shadow-md
    `,
    // Secondary - Teal accent
    secondary: `
      bg-[#5eaaa8] text-white
      hover:bg-[#7bc4c2]
      focus-visible:ring-[#5eaaa8]
      shadow-sm hover:shadow-md
    `,
    // Outline - Bordered with visible background
    outline: `
      bg-[var(--bg-tertiary)] text-[var(--text-primary)]
      border border-[var(--border-strong)]
      hover:border-[var(--accent-secondary)] hover:bg-[var(--bg-hover)]
      focus-visible:ring-[var(--accent-secondary)]
    `,
    // Ghost - Minimal, no border
    ghost: `
      bg-transparent text-[var(--text-secondary)]
      hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]
      focus-visible:ring-[var(--accent-primary)]
    `,
    // Accent - Soft accent background
    accent: `
      bg-[var(--accent-primary-muted)] text-[var(--accent-primary)]
      hover:bg-[var(--accent-primary)] hover:text-[var(--text-inverse)]
      focus-visible:ring-[var(--accent-primary)]
      border border-transparent hover:border-transparent
    `,
  };

  // Get inline styles for primary variant to ensure color is applied
  const getInlineStyles = () => {
    if (variant === 'primary') {
      return { backgroundColor: '#d4a574' };
    }
    return {};
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={getInlineStyles()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg 
            className="animate-spin h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="3"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
          {children}
          {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        </>
      )}
    </button>
  );
}
