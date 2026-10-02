import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';

describe('Badges UI Components', () => {
  it('renders PriorityBadge with correct text and accessible label', () => {
    const { rerender } = render(<PriorityBadge priority="HIGH" />);
    expect(screen.getByRole('status')).toHaveTextContent('HIGH');
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'High Priority');

    rerender(<PriorityBadge priority="LOW" />);
    expect(screen.getByRole('status')).toHaveTextContent('LOW');
  });

  it('renders StatusBadge with correct text and accessible label', () => {
    const { rerender } = render(<StatusBadge status="OPEN" />);
    expect(screen.getByRole('status')).toHaveTextContent('OPEN');
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Status: Open');

    rerender(<StatusBadge status="IN_PROGRESS" />);
    expect(screen.getByRole('status')).toHaveTextContent('IN PROGRESS');
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Status: In Progress');

    rerender(<StatusBadge status="RESOLVED" />);
    expect(screen.getByRole('status')).toHaveTextContent('RESOLVED');
  });
});
