import { render, screen } from '@testing-library/react';
import StatCard from '@/components/ui/StatCard';
import { Calendar } from 'lucide-react';

describe('StatCard Component', () => {
  const defaultProps = {
    title: 'Total Events',
    value: 42,
    subtitle: 'Active this month',
    icon: <Calendar data-testid="stat-icon" />,
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

  it('renders subtitle when provided', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('Active this month')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
  });

  it('applies card styling with border', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white', 'border', 'rounded-xl');
  });

  it('has hover shadow effect', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('hover:shadow-md');
  });

  it('displays value with large font', () => {
    render(<StatCard {...defaultProps} />);
    const value = screen.getByText('42');
    expect(value).toHaveClass('text-3xl', 'font-semibold');
  });

  it('renders zero values', () => {
    render(<StatCard {...defaultProps} value={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders positive trend indicator', () => {
    render(<StatCard {...defaultProps} trend={{ value: 12, isPositive: true }} />);
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('renders negative trend indicator', () => {
    render(<StatCard {...defaultProps} trend={{ value: -5, isPositive: false }} />);
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });
});
