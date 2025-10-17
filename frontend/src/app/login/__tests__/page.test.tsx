import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { login as loginAPI, resendVerification } from '@/api/auth';
import LoginPage from '../page';
import '@testing-library/jest-dom';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the auth API
jest.mock('@/api/auth', () => ({
  login: jest.fn(),
  resendVerification: jest.fn(),
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup the mock router
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Setup the mock auth context
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  it('renders the login form', () => {
    render(<LoginPage />);
    
    // Check if the form elements are rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('validates the form', async () => {
    render(<LoginPage />);
    
    // Try to submit the form without filling in any fields
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Check if validation errors are shown
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Check required validation
    expect(emailInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();
    
    // Check that the login function was not called
    expect(loginAPI).not.toHaveBeenCalled();
  });

  it('handles successful login', async () => {
    // Mock a successful login response
    (loginAPI as jest.Mock).mockResolvedValueOnce({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: { id: 1, email: 'test@example.com' },
    });

    render(<LoginPage />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Check that the login API was called with the correct data
    await waitFor(() => {
      expect(loginAPI).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      
      // Check that the auth context login was called
      expect(mockLogin).toHaveBeenCalledWith(
        'mock-access-token',
        'mock-refresh-token',
        { id: 1, email: 'test@example.com' }
      );
      
      // Check that the user is redirected to the dashboard
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login error', async () => {
    // Mock a failed login response
    const errorMessage = 'Invalid credentials';
    (loginAPI as jest.Mock).mockRejectedValueOnce({
      response: {
        data: { message: errorMessage },
      },
    });

    render(<LoginPage />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Check that the error message is displayed
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('handles unverified email', async () => {
    // Mock an unverified email response
    (loginAPI as jest.Mock).mockRejectedValueOnce({
      response: {
        status: 403,
        data: { message: 'Please verify your email address' },
      },
    });

    render(<LoginPage />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'unverified@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Check that the verify email button is shown
    const verifyButton = await screen.findByRole('button', { name: /verify email/i });
    expect(verifyButton).toBeInTheDocument();
    
    // Mock a successful resend verification response
    (resendVerification as jest.Mock).mockResolvedValueOnce({});
    
    // Click the verify button
    fireEvent.click(verifyButton);
    
    // Check that the button text changes to 'Email Sent' and is disabled
    const sentButton = await screen.findByRole('button', { name: /email sent/i });
    expect(sentButton).toBeInTheDocument();
    expect(sentButton).toBeDisabled();
  });
});
