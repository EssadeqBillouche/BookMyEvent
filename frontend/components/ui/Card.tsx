/**
 * Card Component
 * 
 * Reusable container component with consistent styling.
 * Provides white background, shadow, and rounded corners.
 * 
 * @component
 */

import { ReactNode } from 'react';

/**
 * Card Props Interface
 */
interface CardProps {
  children: ReactNode;     // Card content
  className?: string;      // Additional CSS classes
}

/**
 * Card Component
 * 
 * Generic container for grouping related content with elevation.
 * 
 * Features:
 * - White background for content separation
 * - Rounded corners for modern aesthetic
 * - Shadow for depth and hierarchy
 * - Padding for content spacing
 * 
 * @param children - Content to be displayed inside card
 * @param className - Optional additional CSS classes
 * 
 * @example
 * ```tsx
 * <Card>
 *   <h2>Card Title</h2>
 *   <p>Card content goes here...</p>
 * </Card>
 * ```
 */
export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`glass-card p-8 backdrop-blur-2xl ${className}`} style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
      {children}
    </div>
  );
}
