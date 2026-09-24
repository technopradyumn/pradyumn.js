import React, { Component, ErrorInfo, ReactNode } from "react";

export interface ErrorBoundaryProps {
  /** Fallback node or render function receiving error and reset handler */
  fallback: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Optional error reporting callback */
  onError?: (error: Error, info: ErrorInfo) => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Declarative crash barrier that catches render errors and presents a recovery fallback.
 *
 * @example
 * <ErrorBoundary fallback={(err, reset) => <button onClick={reset}>Try Again</button>}>
 *   <RiskyWidget />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === "function") {
        return (this.props.fallback as (err: Error, reset: () => void) => ReactNode)(
          this.state.error,
          this.reset
        );
      }
      return this.props.fallback;
    }

    return this.props.children;
  }
}
