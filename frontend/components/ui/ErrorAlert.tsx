/**
 * Error Alert Component
 * 
 * Premium error message display with elegant styling.
 * Supports dark/light themes via CSS variables.
 * Part of the EventBook design system.
 * 
 * @component
 */

import { AlertCircle, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useState } from 'react';

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  message: string;
  variant?: AlertVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  title?: string;
}

export default function Alert({ 
  message, 
  variant = 'error',
  dismissible = false, 
  onDismiss,
  title 
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  const variants = {
    error: {
      bg: 'bg-[var(--error-muted)]',
      border: 'border-[var(--error)]',
      text: 'text-[var(--error)]',
      icon: AlertCircle,
    },
    success: {
      bg: 'bg-[var(--success-muted)]',
      border: 'border-[var(--success)]',
      text: 'text-[var(--success)]',
      icon: CheckCircle,
    },
    warning: {
      bg: 'bg-[var(--warning-muted)]',
      border: 'border-[var(--warning)]',
      text: 'text-[var(--warning)]',
      icon: AlertTriangle,
    },
    info: {
      bg: 'bg-[var(--info-muted)]',
      border: 'border-[var(--info)]',
      text: 'text-[var(--info)]',
      icon: Info,
    },
  };

  const { bg, border, text, icon: Icon } = variants[variant];

  return (
    <div 
      className={`
        mb-4 p-4 rounded-lg 
        flex items-start gap-3 
        ${bg} 
        border ${border}/30
        animate-fade-in
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${text} mt-0.5`} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`text-sm font-medium ${text} mb-1`}>{title}</p>
        )}
        <p className={`text-sm ${text} opacity-90`}>{message}</p>
      </div>
      {dismissible && (
        <button 
          onClick={handleDismiss}
          className={`
            ${text} 
            hover:opacity-70 
            transition-opacity 
            p-1 
            rounded
            focus:outline-none focus-visible:ring-2 focus-visible:ring-current
          `}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Export ErrorAlert as an alias for backwards compatibility
export { Alert as ErrorAlert };
