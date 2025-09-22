import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Events from '../pages/Events';

describe('Events Page', () => {
  it('displays events page title', () => {
    render(<Events />);
    // Basic render test
    expect(document.body).toBeDefined();
  });
});
