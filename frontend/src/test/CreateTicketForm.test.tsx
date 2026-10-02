import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CreateTicketPage } from '../pages/CreateTicketPage';

describe('CreateTicketPage Component', () => {
  it('renders all form input fields and live character counter', () => {
    render(
      <MemoryRouter>
        <CreateTicketPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/ticket title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/customer email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText('0/120')).toBeInTheDocument();
  });

  it('updates live character counter as user types in title', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CreateTicketPage />
      </MemoryRouter>
    );

    const titleInput = screen.getByLabelText(/ticket title/i);
    await user.type(titleInput, 'Database connection timeout');

    expect(screen.getByText('27/120')).toBeInTheDocument();
  });

  it('shows client-side inline validation errors when submitting an empty form', async () => {
    render(
      <MemoryRouter>
        <CreateTicketPage />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /submit ticket/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/customer email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
  });

  it('validates invalid email format', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CreateTicketPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/customer email/i);
    await user.type(emailInput, 'invalid-email-string');
    fireEvent.blur(emailInput);

    const submitBtn = screen.getByRole('button', { name: /submit ticket/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/customer email must be a valid email address/i)
      ).toBeInTheDocument();
    });
  });
});
