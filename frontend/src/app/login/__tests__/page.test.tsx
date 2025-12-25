import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { resendVerification } from '@/api/auth';
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
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();
    const submitBtn = screen.getByText(/log in/i).closest('button');
    expect(submitBtn).toBeInTheDocument();
  });

  it('validates the form', async () => {
    render(<LoginPage />);
    
    // Try to submit the form without filling in any fields
  // Find the submit button by its visible text and click its parent button element
  const submitBtn = screen.getByText(/log in/i).closest('button');
  expect(submitBtn).toBeTruthy();
  fireEvent.click(submitBtn as HTMLButtonElement);
    
    // Check if validation errors are shown
    const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' });
    
    // Check required validation
    expect(emailInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();
    
  // Check that the login function on the auth context was not called
  expect(mockLogin).not.toHaveBeenCalled();
  });

  it('handles successful login', async () => {
    // Mock a successful login response from the auth context
    (mockLogin as jest.Mock).mockResolvedValueOnce({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: { id: 1, email: 'test@example.com' },
    });

    render(<LoginPage />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i, { selector: 'input' }), {
      target: { value: 'password123' },
    });
    
  // Submit the form by finding the visible text and clicking the enclosing button
  const submitBtn2 = screen.getByText(/log in/i).closest('button');
  expect(submitBtn2).toBeTruthy();
  fireEvent.click(submitBtn2 as HTMLButtonElement);
    
    // Check that the login API was called with the correct data
    await waitFor(() => {
      // Check that the auth context login was called with the expected payload
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      
      // And that the router redirected
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login error', async () => {
    // Mock a failed login response via the auth context
    const errorMessage = 'Invalid credentials';
    (mockLogin as jest.Mock).mockRejectedValueOnce({
      response: {
        data: { message: errorMessage },
      },
    });

    render(<LoginPage />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i, { selector: 'input' }), {
      target: { value: 'wrongpassword' },
    });
    
  // Submit the form by finding the visible text and clicking the enclosing button
  const submitBtn3 = screen.getByText(/log in/i).closest('button');
  expect(submitBtn3).toBeTruthy();
  fireEvent.click(submitBtn3 as HTMLButtonElement);
    
  // Check that the error message is displayed
  expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('handles unverified email', async () => {
    // Mock an unverified email response via the auth context
    (mockLogin as jest.Mock).mockRejectedValueOnce({
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
    fireEvent.change(screen.getByLabelText(/password/i, { selector: 'input' }), {
      target: { value: 'password123' },
    });
    
  // Submit the form by finding the visible text and clicking the enclosing button
  const submitBtn4 = screen.getByText(/log in/i).closest('button');
  expect(submitBtn4).toBeTruthy();
  fireEvent.click(submitBtn4 as HTMLButtonElement);
    
  // Check that the resend verification button is shown
  const resendBtn = await screen.findByRole('button', { name: /resend verification email/i });
  expect(resendBtn).toBeInTheDocument();
    
  // Mock a successful resend verification response
  (resendVerification as jest.Mock).mockResolvedValueOnce({});
    
  // Click the resend button
  fireEvent.click(resendBtn);
    
  // Check that the resendVerification API was called with the user's email
  expect(resendVerification).toHaveBeenCalledWith('unverified@example.com');
  });
});
