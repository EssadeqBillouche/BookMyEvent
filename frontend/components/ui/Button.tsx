import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

export default function Button({ children, variant = 'primary', loading, disabled, className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'text-white hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border-2 bg-transparent hover:bg-gray-50',
  };

  const primaryStyle = {
    background: variant === 'primary' ? 'linear-gradient(to right, #003580, #009fe3)' : undefined,
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={primaryStyle}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
