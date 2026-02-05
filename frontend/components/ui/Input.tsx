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
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        {/* Leading Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        
        {/* Input Field */}
        <input
          id={id}
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          {...props}
        />
        
        {/* Error Message */}
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    </div>
  );
}
