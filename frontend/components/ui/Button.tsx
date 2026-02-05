/**
 * Button Component
 * 
 * Reusable button with multiple style variants and loading states.
 * Follows design system color palette and spacing.
 * 
 * @component
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Button Props Interface
 * 
 * Extends standard HTML button attributes with custom props.
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

/**
 * Button Component
 * 
 * Versatile button component with consistent styling across the application.
 * 
 * @param children - Button content (text, icons, etc.)
 * @param variant - Visual style variant (default: 'primary')
 * @param loading - Show loading state and disable interaction
 * @param disabled - Disable button interaction
 * @param className - Additional CSS classes
 * @param props - Any other standard button HTML attributes
 * 
 * @example
 * ```tsx
 * <Button variant="primary" loading={isSubmitting}>
 *   Submit Form
 * </Button>
 * ```
 */
export default function Button({ children, variant = 'primary', loading, disabled, className = '', ...props }: ButtonProps) {
  // Base styles applied to all button variants
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  /**
   * Style variants for different button types
   * - primary: Brand gradient with white text
   * - secondary: Gray background for less emphasis
   * - outline: Transparent with border
   */
  const variants = {
    primary: 'text-white hover:shadow-2xl hover:scale-105',
    secondary: 'text-white/90 hover:bg-white/15',
    outline: 'border-2 bg-transparent hover:shadow-xl text-white',
  };

  const primaryStyle = {
    background: variant === 'primary' ? 'linear-gradient(135deg, rgba(78, 205, 196, 0.8) 0%, rgba(110, 231, 222, 0.8) 100%)' : 
                variant === 'secondary' ? 'rgba(255, 255, 255, 0.1)' : undefined,
    borderColor: variant === 'outline' ? 'rgba(255, 255, 255, 0.3)' : variant === 'primary' ? 'rgba(78, 205, 196, 0.4)' : undefined,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={primaryStyle}
      disabled={disabled || loading}
      {...props}
    >
      {/* Display loading text when in loading state */}
      {loading ? 'Loading...' : children}
    </button>
  );
}
