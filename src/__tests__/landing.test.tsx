import "@testing-library/jest-dom";
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Landing Page', () => {
  it('renders the main marketing headings', () => {
    render(<Home />);
    
    expect(screen.getByText(/Pure Honey/i)).toBeTruthy();
    expect(screen.getByText(/Traceable from Hive to Home/i)).toBeTruthy();
    expect(screen.getByText(/How HoneyChain Works/i)).toBeTruthy();
  });

  it('renders the verify CTA link', () => {
    render(<Home />);
    const link = screen.getByRole('link', { name: /Verify Your Honey Jar/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/verify');
  });

  it('renders the how it works steps', () => {
    render(<Home />);
    expect(screen.getByText(/1. Harvested/i)).toBeTruthy();
    expect(screen.getByText(/2. Processed & Tested/i)).toBeTruthy();
    expect(screen.getByText(/3. Delivered to You/i)).toBeTruthy();
  });
});
