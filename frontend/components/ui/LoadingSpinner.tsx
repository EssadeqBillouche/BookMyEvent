/**
 * Loading Spinner Component
 * 
 * Premium loading indicator with smooth animations.
 * Supports dark/light themes via CSS variables.
 * Part of the EventBook design system.
 * 
 * @component
 */

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ 
  fullScreen = true, 
  size = 'md',
  text = 'Loading...'
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          ${sizes[size]} 
          rounded-full 
          animate-spin 
          border-[var(--border-default)] 
          border-t-[var(--accent-primary)]
        `}
      />
      {text && (
        <p className="text-sm text-[var(--text-secondary)] animate-pulse-soft">
          {text}
        </p>
      )}
    </div>
  );

  if (!fullScreen) return spinner;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      {spinner}
    </div>
  );
}
