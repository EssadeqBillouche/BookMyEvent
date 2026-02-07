import { render, screen } from '@testing-library/react';
import Card from '@/components/ui/Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies glassmorphism styling', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('glass-card');
  });

  it('applies additional className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('has padding for content spacing', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('p-8');
  });

  it('has backdrop blur effect', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('backdrop-blur-2xl');
  });

  it('renders nested components', () => {
    render(
      <Card>
        <div data-testid="nested">
          <span>Nested content</span>
        </div>
      </Card>
    );
    
    expect(screen.getByTestId('nested')).toBeInTheDocument();
    expect(screen.getByText('Nested content')).toBeInTheDocument();
  });
});
