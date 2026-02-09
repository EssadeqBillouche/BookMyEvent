/**
 * Input Component
 * 
 * Premium form input with elegant styling and smooth focus states.
 * Supports dark/light themes via CSS variables.
 * Part of the EventBook design system.
 * 
 * @component
 */

import { InputHTMLAttributes, ReactNode, useState } from 'react';

/**
 * Input Props Interface
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
}

/**
 * Input Component
 * 
 * Elegant, minimal input field with optional icon and error state.
 * All colors use CSS variables for seamless theme switching.
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email Address"
 *   icon={<Mail className="w-5 h-5" />}
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={emailError}
 * />
 * ```
 */
export default function Input({ label, icon, error, hint, id, className = '', ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {/* Label */}
      <label 
        htmlFor={id} 
        className="block text-sm font-medium mb-2 text-[var(--text-primary)]"
      >
        {label}
      </label>
      
      <div className="relative">
        {/* Leading Icon */}
        {icon && (
          <div className={`
            absolute left-3.5 top-1/2 transform -translate-y-1/2 
            transition-colors duration-200
            ${isFocused ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'}
            ${error ? 'text-[var(--error)]' : ''}
          `}>
            {icon}
          </div>
        )}
        
        {/* Input Field */}
        <input
          id={id}
          className={`
            w-full 
            bg-[var(--bg-elevated)]
            ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3
            rounded-lg
            border 
            transition-all duration-200
            text-[var(--text-primary)] 
            placeholder-[var(--text-tertiary)]
            focus:outline-none
            ${error 
              ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-2 focus:ring-[var(--error-muted)]' 
              : `border-[var(--border-default)] 
                 hover:border-[var(--border-strong)] 
                 focus:border-[var(--accent-primary)] 
                 focus:ring-2 focus:ring-[var(--accent-primary-muted)]`
            }
            ${className}
          `}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="text-sm mt-2 text-[var(--error)] flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      
      {/* Hint Text */}
      {hint && !error && (
        <p className="text-sm mt-2 text-[var(--text-tertiary)]">{hint}</p>
      )}
    </div>
  );
}
