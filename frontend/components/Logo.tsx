/**
 * Logo Component
 * 
 * Premium brand logo with elegant styling.
 * Supports dark/light themes via CSS variables.
 * Part of the EventBook design system.
 * 
 * @component
 */

import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { container: 'w-7 h-7', text: 'text-xs', logo: 'text-base' },
    md: { container: 'w-8 h-8', text: 'text-sm', logo: 'text-lg' },
    lg: { container: 'w-10 h-10', text: 'text-base', logo: 'text-xl' },
  };

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* Logo Mark */}
      <div 
        className={`
          ${sizes[size].container}
          bg-[var(--accent-primary)] 
          rounded-lg 
          flex items-center justify-center
          transition-all duration-300
          group-hover:shadow-[var(--shadow-glow)]
          group-hover:scale-105
        `}
      >
        <span className={`text-[var(--text-inverse)] font-bold ${sizes[size].text}`}>
          E
        </span>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span 
          className={`
            ${sizes[size].logo}
            font-semibold 
            tracking-tight 
            text-[var(--text-primary)] 
            group-hover:text-[var(--accent-primary)] 
            transition-colors duration-200
          `}
        >
          eventbook
        </span>
      )}
    </Link>
  );
}
