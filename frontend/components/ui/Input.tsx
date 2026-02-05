/**
 * Input Component
 * 
 * Reusable form input with label, icon, and error state support.
 * Provides consistent styling and accessibility across forms.
 * 
 * @component
 */

import { InputHTMLAttributes, ReactNode } from 'react';

/**
 * Input Props Interface
 * 
 * Extends standard HTML input attributes with custom props.
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;      // Accessible label text
  icon: ReactNode;    // Leading icon (e.g., Mail, Lock)
  error?: string;     // Error message to display
}

/**
 * Input Component
 * 
 * Form input field with consistent design and accessibility features.
 * 
 * Features:
 * - Accessible label with htmlFor association
 * - Leading icon for visual context
 * - Error state with message display
 * - Focus ring for keyboard navigation
 * - Full HTML input compatibility
 * 
 * @param label - Text label for the input field
 * @param icon - Icon element to display before input
 * @param error - Optional error message
 * @param id - HTML id for label association
 * @param props - Any standard HTML input attributes
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
export default function Input({ label, icon, error, id, ...props }: InputProps) {
  return (
    <div>
      {/* Accessible Label */}
      <label htmlFor={id} className="block text-sm font-medium mb-2 text-white">
        {label}
      </label>
      
      <div className="relative">
        {/* Leading Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
          {icon}
        </div>
        
        {/* Input Field - Glassmorphism */}
        <input
          id={id}
          className="glass-card w-full pl-11 pr-4 py-3 rounded-lg outline-none transition-all text-white placeholder-white/40"
          style={{ 
            background: 'rgba(255, 255, 255, 0.12)',
            borderColor: error ? 'rgba(78, 205, 196, 0.5)' : 'rgba(255, 255, 255, 0.25)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#4ecdc4';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(78, 205, 196, 0.2)';
          }}
          onBlur={(e) => {
            if (!error) e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...props}
        />
        
        {/* Error Message */}
        {error && <p className="text-sm mt-1" style={{ color: '#4ecdc4' }}>{error}</p>}
      </div>
    </div>
  );
}
