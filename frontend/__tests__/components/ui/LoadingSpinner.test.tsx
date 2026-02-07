import { render, screen } from '@testing-library/react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders loading text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders spinner animation element', () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('takes full screen height', () => {
    render(<LoadingSpinner />);
    const container = screen.getByText('Loading...').parentElement?.parentElement;
    expect(container).toHaveClass('min-h-screen');
  });

  it('centers content', () => {
    render(<LoadingSpinner />);
    const container = screen.getByText('Loading...').parentElement?.parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('has gradient background', () => {
    render(<LoadingSpinner />);
    const container = screen.getByText('Loading...').parentElement?.parentElement;
    expect(container).toHaveClass('bg-gradient-to-br');
  });

  it('spinner has correct dimensions', () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('w-16', 'h-16');
  });

  it('spinner has rounded shape', () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('rounded-full');
  });
});
