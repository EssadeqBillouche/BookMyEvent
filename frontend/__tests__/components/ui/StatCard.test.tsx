import { render, screen } from '@testing-library/react';
import StatCard from '@/components/ui/StatCard';
import { Calendar } from 'lucide-react';

describe('StatCard Component', () => {
  const defaultProps = {
    title: 'Total Events',
    value: 42,
    subtitle: 'Active this month',
    icon: <Calendar data-testid="stat-icon" />,
    iconBgColor: 'rgba(78, 205, 196, 0.2)',
    iconColor: '#4ecdc4',
  };

  it('renders title correctly', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('Total Events')).toBeInTheDocument();
  });

  it('renders numeric value', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(<StatCard {...defaultProps} value="$1,234" />);
    expect(screen.getByText('$1,234')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('Active this month')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
  });

  it('applies glassmorphism styling', () => {
    render(<StatCard {...defaultProps} />);
    const card = screen.getByText('Total Events').closest('.glass-card');
    expect(card).toBeInTheDocument();
  });

  it('has hover scale effect class', () => {
    render(<StatCard {...defaultProps} />);
    const card = screen.getByText('Total Events').closest('.glass-card');
    expect(card).toHaveClass('hover:scale-105');
  });

  it('displays value with large font', () => {
    render(<StatCard {...defaultProps} />);
    const value = screen.getByText('42');
    expect(value).toHaveClass('text-4xl', 'font-bold');
  });

  it('renders zero values', () => {
    render(<StatCard {...defaultProps} value={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
