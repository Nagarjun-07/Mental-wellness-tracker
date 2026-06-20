import { render, screen, waitFor } from '@testing-library/react';
import { BurnoutRadar } from '../BurnoutRadar';
import '@testing-library/jest-dom';

// Mock the hooks and actions
jest.mock('@/lib/hooks/useUser', () => ({
  useUser: () => 'test-user-id',
}));

jest.mock('@/app/actions', () => ({
  getBurnoutScore: jest.fn().mockResolvedValue({ score: 75, explanation: 'Test explanation' }),
}));

// Mock ResizeObserver for Recharts
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

describe('BurnoutRadar Component', () => {
  it('renders loading state initially and then loads', async () => {
    render(<BurnoutRadar />);
    // The heading is not rendered while loading, it returns the loader Card
    expect(screen.queryByRole('heading', { name: /burnout radar/i })).not.toBeInTheDocument();
    
    // Wait for the state changes to complete to prevent un-act-wrapped warnings
    await waitFor(() => {
      expect(screen.getByText('75')).toBeInTheDocument();
    });
  });

  it('renders burnout score after loading', async () => {
    render(<BurnoutRadar />);
    
    await waitFor(() => {
      expect(screen.getByText('75')).toBeInTheDocument();
      expect(screen.getByText('Test explanation')).toBeInTheDocument();
    });
  });
});
