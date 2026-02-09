/**
 * Stat Card Component
 * 
 * Premium statistic display card with elegant styling.
 * Supports dark/light themes via CSS variables.
 * Part of the EventBook design system.
 * 
 * @component
 */

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'accent';
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend,
  variant = 'default'
}: StatCardProps) {
  return (
    <div 
      className={`
        rounded-xl p-6 
        transition-all duration-200 
        hover:shadow-[var(--shadow-md)]
        ${variant === 'accent' 
          ? 'bg-[var(--accent-primary-muted)] border border-[var(--accent-primary)]/20' 
          : 'bg-[var(--bg-elevated)] border border-[var(--border-default)]'
        }
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className={`
            w-10 h-10 rounded-lg 
            flex items-center justify-center 
            ${variant === 'accent'
              ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
            }
          `}
        >
          {icon}
        </div>
        {trend && (
          <span 
            className={`
              text-xs font-medium px-2 py-1 rounded-md
              ${trend.isPositive 
                ? 'bg-[var(--success-muted)] text-[var(--success)]' 
                : 'bg-[var(--error-muted)] text-[var(--error)]'
              }
            `}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      
      <p 
        className={`
          text-3xl font-semibold mb-1 tracking-tight
          ${variant === 'accent' 
            ? 'text-[var(--accent-primary)]' 
            : 'text-[var(--text-primary)]'
          }
        `}
      >
        {value}
      </p>
      
      <p className="text-sm text-[var(--text-secondary)]">{title}</p>
      
      {subtitle && (
        <p className="text-xs text-[var(--text-tertiary)] mt-2">{subtitle}</p>
      )}
    </div>
  );
}
