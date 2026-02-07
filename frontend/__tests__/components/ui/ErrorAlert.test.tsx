import { render, screen } from '@testing-library/react';
import ErrorAlert from '@/components/ui/ErrorAlert';

describe('ErrorAlert Component', () => {
  it('renders error message', () => {
    render(<ErrorAlert message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders the alert icon', () => {
    render(<ErrorAlert message="Error" />);
    // The AlertCircle icon from lucide-react should be present
    const container = screen.getByText('Error').parentElement;
    expect(container?.querySelector('svg')).toBeInTheDocument();
  });

  it('applies glassmorphism styling', () => {
    render(<ErrorAlert message="Error" />);
    const alert = screen.getByText('Error').parentElement;
    expect(alert).toHaveClass('glass-card');
  });

  it('has proper margin bottom', () => {
    render(<ErrorAlert message="Error" />);
    const alert = screen.getByText('Error').parentElement;
    expect(alert).toHaveClass('mb-6');
  });

  it('displays long error messages', () => {
    const longMessage = 'This is a very long error message that contains detailed information about what went wrong during the operation.';
    render(<ErrorAlert message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('renders with flex layout', () => {
    render(<ErrorAlert message="Error" />);
    const alert = screen.getByText('Error').parentElement;
    expect(alert).toHaveClass('flex', 'items-start');
  });
});
