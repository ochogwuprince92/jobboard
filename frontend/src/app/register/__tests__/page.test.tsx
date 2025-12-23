import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import RegisterPage from '../page';
import '@testing-library/jest-dom';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the auth API
jest.mock('@/api/auth', () => ({
  register: jest.fn(),
}));

import { register as registerAPI } from '@/api/auth';

describe('RegisterPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders the register form', () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  expect(screen.getByLabelText('Password', { selector: 'input' })).toBeInTheDocument();
  expect(screen.getByLabelText('Confirm Password', { selector: 'input' })).toBeInTheDocument();
  });

  it('handles message-only registration', async () => {
    (registerAPI as jest.Mock).mockResolvedValueOnce({ message: 'verify your email', user: null });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 't@u.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
  fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), { target: { value: 'password123' } });
  fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input' }), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // success message should appear
    const success = await screen.findByText(/registration successful/i);
    expect(success).toBeInTheDocument();
  });

  it('handles empty-success registration (no body)', async () => {
    (registerAPI as jest.Mock).mockResolvedValueOnce({});

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Empty' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Case' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'e@e.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
  fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), { target: { value: 'password123' } });
  fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input' }), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    const success = await screen.findByText(/registration successful/i);
    expect(success).toBeInTheDocument();
  });
});
