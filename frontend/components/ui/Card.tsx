/**
 * Card Component
 * 
 * Premium container with elegant styling and subtle interactions.
 * Supports dark/light themes via CSS variables.
 * Part of the EventBook design system.
 * 
 * @component
 */

import { ReactNode } from 'react';

/**
 * Card Props Interface
 */
interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

/**
 * Card Component
 * 
 * Elegant container for grouping related content.
 * All colors use CSS variables for seamless theme switching.
 * 
 * @example
 * ```tsx
 * <Card variant="elevated" hover>
 *   <h2>Card Title</h2>
 *   <p>Card content goes here...</p>
 * </Card>
 * ```
 */
export default function Card({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  /**
   * Variant styles using CSS variables
   */
  const variantStyles = {
    // Default - Standard card with subtle border
    default: `
      bg-[var(--bg-elevated)] 
      border border-[var(--border-default)]
      shadow-[var(--shadow-sm)]
    `,
    // Outlined - Transparent with visible border
    outlined: `
      bg-transparent 
      border border-[var(--border-default)]
    `,
    // Elevated - Enhanced shadow for prominence
    elevated: `
      bg-[var(--bg-elevated)] 
      border border-[var(--border-subtle)]
      shadow-[var(--shadow-md)]
    `,
    // Glass - Subtle frosted effect
    glass: `
      glass-card
    `,
    // Gradient - Gradient border accent
    gradient: `
      gradient-border
    `,
  };

  const hoverStyles = hover 
    ? `
        cursor-pointer
        transition-all duration-200 ease-out
        hover:shadow-[var(--shadow-lg)] 
        hover:border-[var(--border-strong)]
        hover:-translate-y-0.5
        active:scale-[0.99]
      ` 
    : 'transition-all duration-200';

  return (
    <div 
      className={`
        rounded-xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
