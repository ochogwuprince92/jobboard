import React from 'react';
import { render, screen } from '../../utils/test-utils';
import ErrorBoundary from './ErrorBoundary';

// A component that throws an error
const ErrorComponent = () => {
  throw new Error('Test Error');
};

describe('ErrorBoundary', () => {
  // Suppress console.error for the error boundary test
  const originalError = console.error;
  
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="test-content">Test Content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('displays error message when child component throws', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(
      screen.getByText("We're sorry for the inconvenience. Please try refreshing the page.")
    ).toBeInTheDocument();
    
    expect(
      screen.getByRole('button', { name: /refresh page/i })
    ).toBeInTheDocument();
  });

  it('refreshes the page when refresh button is clicked', () => {
    // Mock window.location.reload
    const reloadMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByRole('button', { name: /refresh page/i });
    refreshButton.click();

    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
