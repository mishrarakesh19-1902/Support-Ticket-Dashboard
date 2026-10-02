import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../components/common/EmptyState';
import { Pagination } from '../components/common/Pagination';

describe('EmptyState & Pagination Components', () => {
  it('renders EmptyState with custom title and fires onClearFilters callback', () => {
    const handleClear = vi.fn();
    render(
      <EmptyState
        title="No tickets match your filters"
        description="Try adjusting your search criteria."
        onClearFilters={handleClear}
      />
    );

    expect(screen.getByText('No tickets match your filters')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria.')).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: /clear all filters/i });
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('renders Pagination correctly and disables Previous on page 1', () => {
    const handlePageChange = vi.fn();
    const { rerender } = render(
      <Pagination
        currentPage={1}
        totalPages={4}
        totalItems={33}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />
    );

    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing 1 to 10 of 33 results');
    expect(screen.getByText('Page 1 of 4')).toBeInTheDocument();

    const prevBtn = screen.getByRole('button', { name: /previous page/i });
    const nextBtn = screen.getByRole('button', { name: /next page/i });

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeEnabled();

    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(2);

    // Rerender on last page
    rerender(
      <Pagination
        currentPage={4}
        totalPages={4}
        totalItems={33}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />
    );

    expect(screen.getByRole('button', { name: /previous page/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
  });
});
