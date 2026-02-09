/**
 * Page Layout Component
 * 
 * Premium page wrapper with seamless theme support.
 * Supports dark/light themes via CSS variables.
 * Part of the EventBook design system.
 * 
 * @component
 */

import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div 
      className={`
        min-h-screen 
        page-transition
        bg-[var(--bg-primary)] 
        text-[var(--text-primary)]
        transition-colors duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
