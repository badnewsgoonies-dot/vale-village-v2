/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 */

import { Component, ComponentChildren, JSX } from 'preact';

interface ErrorBoundaryProps {
  children: ComponentChildren;
  fallback?: (error: Error, reset: () => void) => JSX.Element;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return <DefaultErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  onReset: () => void;
}

function DefaultErrorFallback({ error, onReset }: DefaultErrorFallbackProps): JSX.Element {
  return (
    <div class="error-boundary">
      <div class="error-content">
        <h1>Something went wrong</h1>
        <p class="error-message">
          The game encountered an unexpected error. You can try to recover or reload the page.
        </p>
        <details class="error-details">
          <summary>Error Details</summary>
          <pre>{error.message}</pre>
          {error.stack && <pre class="error-stack">{error.stack}</pre>}
        </details>
        <div class="error-actions">
          <button onClick={onReset} class="error-btn error-btn-primary">
            Try Again
          </button>
          <button onClick={() => window.location.reload()} class="error-btn error-btn-secondary">
            Reload Page
          </button>
        </div>
      </div>
      <style>{`
        .error-boundary {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, #1a0a00 0%, #2a1a10 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          z-index: 9999;
        }
        .error-content {
          max-width: 600px;
          background: #3a2a1a;
          border: 3px solid #8b6a4a;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }
        .error-content h1 {
          color: #ff6b6b;
          font-size: 2rem;
          margin: 0 0 1rem 0;
        }
        .error-message {
          color: #ccc;
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }
        .error-details {
          text-align: left;
          background: #2a1a0a;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        .error-details summary {
          cursor: pointer;
          color: #aaa;
          font-size: 0.9rem;
        }
        .error-details pre {
          color: #ff6b6b;
          font-size: 0.8rem;
          white-space: pre-wrap;
          word-break: break-word;
          margin: 0.5rem 0 0 0;
        }
        .error-stack {
          color: #888 !important;
          font-size: 0.7rem !important;
          max-height: 150px;
          overflow-y: auto;
        }
        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        .error-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .error-btn:hover {
          transform: translateY(-2px);
        }
        .error-btn-primary {
          background: linear-gradient(180deg, #ffd87f 0%, #f3c866 100%);
          color: #1a0a00;
          box-shadow: 0 4px 12px rgba(255, 216, 127, 0.4);
        }
        .error-btn-secondary {
          background: #4a3a2a;
          color: #fff;
          border: 2px solid #8b6a4a;
        }
      `}</style>
    </div>
  );
}
