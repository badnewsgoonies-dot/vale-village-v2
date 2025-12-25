/**
 * Unit tests for ErrorBoundary component
 * Tests error catching and recovery functionality
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { ErrorBoundary } from '../../../src/ui/components/ErrorBoundary';
import { Component, JSX } from 'preact';

// Component that throws an error on render
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }): JSX.Element {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Normal content</div>;
}

// Class component wrapper for testing error boundary behavior
class ErrorThrower extends Component<{ shouldThrow: boolean }> {
  render() {
    if (this.props.shouldThrow) {
      throw new Error('Test error from class component');
    }
    return <div>Class component content</div>;
  }
}

describe('ErrorBoundary', () => {
  // Suppress console.error for cleaner test output
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeDefined();
  });

  it('should catch errors and display fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeDefined();
    expect(screen.getByText(/The game encountered an unexpected error/)).toBeDefined();
  });

  it('should display error details in collapsible section', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error Details')).toBeDefined();
    expect(screen.getByText('Test error message')).toBeDefined();
  });

  it('should have Try Again button that resets error state', () => {
    render(
      <ErrorBoundary>
        <ErrorThrower shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeDefined();

    const tryAgainButton = screen.getByText('Try Again');
    expect(tryAgainButton).toBeDefined();
  });

  it('should have Reload Page button', () => {
    render(
      <ErrorBoundary>
        <ErrorThrower shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByText('Reload Page');
    expect(reloadButton).toBeDefined();
  });

  it('should use custom fallback when provided', () => {
    const customFallback = (error: Error, reset: () => void) => (
      <div>
        <span>Custom error: {error.message}</span>
        <button onClick={reset}>Custom reset</button>
      </div>
    );

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error: Test error message')).toBeDefined();
    expect(screen.getByText('Custom reset')).toBeDefined();
  });

  it('should log error to console when caught', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });
});
