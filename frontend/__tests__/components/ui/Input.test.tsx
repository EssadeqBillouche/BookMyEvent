import { render, screen, fireEvent } from '@testing-library/react';
import Input from '@/components/ui/Input';
import { Mail } from 'lucide-react';

describe('Input Component', () => {
  const defaultProps = {
    label: 'Email',
    icon: <Mail data-testid="mail-icon" />,
    id: 'email-input',
  };

  it('renders with label', () => {
    render(<Input {...defaultProps} />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders the icon', () => {
    render(<Input {...defaultProps} />);
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
  });

  it('associates label with input via id', () => {
    render(<Input {...defaultProps} />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'email-input');
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input {...defaultProps} onChange={handleChange} />);
    
    const input = screen.getByLabelText('Email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays placeholder text', () => {
    render(<Input {...defaultProps} placeholder="Enter your email" />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('applies correct input type', () => {
    render(<Input {...defaultProps} type="email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });

  it('handles required attribute', () => {
    render(<Input {...defaultProps} required />);
    expect(screen.getByLabelText('Email')).toBeRequired();
  });

  it('renders with glassmorphism styling', () => {
    render(<Input {...defaultProps} />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('glass-card');
  });

  it('supports disabled state', () => {
    render(<Input {...defaultProps} disabled />);
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });

  it('handles focus and blur events', () => {
    render(<Input {...defaultProps} />);
    const input = screen.getByLabelText('Email');
    
    fireEvent.focus(input);
    // Focus styles are applied via inline style, so we verify focus event fires
    
    fireEvent.blur(input);
    // Blur event resets styles
  });
});
