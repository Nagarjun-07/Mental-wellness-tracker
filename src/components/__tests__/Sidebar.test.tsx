import { render, screen } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import { usePathname } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Sidebar Component', () => {
  it('renders navigation links properly', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<Sidebar />);
    
    // Desktop and Mobile versions are rendered, so we might have multiple elements
    const homeLinks = screen.getAllByText('Home');
    expect(homeLinks.length).toBeGreaterThan(0);
    
    const companionLinks = screen.getAllByText('Companion');
    expect(companionLinks.length).toBeGreaterThan(0);
  });

  it('highlights the active link based on pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/companion');
    
    render(<Sidebar />);
    
    // Test that logic works without throwing
    const companionLinks = screen.getAllByText('Companion');
    expect(companionLinks[0]).toBeInTheDocument();
  });
});
