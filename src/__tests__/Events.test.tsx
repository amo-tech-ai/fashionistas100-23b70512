import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Events from '../pages/Events';

describe('Events Page', () => {
  it('displays events page title', () => {
    render(<Events />);
    expect(screen.getByText(/Fashion Events/i)).toBeInTheDocument();
  });
});
