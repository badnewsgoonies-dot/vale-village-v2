"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 */
const preact_1 = require("preact");
class ErrorBoundary extends preact_1.Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                hasError: false,
                error: null,
            }
        });
        Object.defineProperty(this, "handleReset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({ hasError: false, error: null });
            }
        });
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        // Log error for debugging
        console.error('ErrorBoundary caught an error:', error);
        console.error('Component stack:', errorInfo.componentStack);
    }
    render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.handleReset);
            }
            return (0, jsx_runtime_1.jsx)(DefaultErrorFallback, { error: this.state.error, onReset: this.handleReset });
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
function DefaultErrorFallback({ error, onReset }) {
    return ((0, jsx_runtime_1.jsxs)("div", { class: "error-boundary", children: [(0, jsx_runtime_1.jsxs)("div", { class: "error-content", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Something went wrong" }), (0, jsx_runtime_1.jsx)("p", { class: "error-message", children: "The game encountered an unexpected error. You can try to recover or reload the page." }), (0, jsx_runtime_1.jsxs)("details", { class: "error-details", children: [(0, jsx_runtime_1.jsx)("summary", { children: "Error Details" }), (0, jsx_runtime_1.jsx)("pre", { children: error.message }), error.stack && (0, jsx_runtime_1.jsx)("pre", { class: "error-stack", children: error.stack })] }), (0, jsx_runtime_1.jsxs)("div", { class: "error-actions", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onReset, class: "error-btn error-btn-primary", children: "Try Again" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.reload(), class: "error-btn error-btn-secondary", children: "Reload Page" })] })] }), (0, jsx_runtime_1.jsx)("style", { children: `
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
      ` })] }));
}
