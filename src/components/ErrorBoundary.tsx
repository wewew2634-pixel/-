'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/Button';

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 * 
 * React 19 compatible error boundary implementation.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Log error to error reporting service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          showDetails={this.props.showDetails}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback UI
 */

interface DefaultErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
  showDetails?: boolean;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  errorInfo,
  onReset,
  showDetails = process.env.NODE_ENV === 'development',
}) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-bg-primary p-4"
      role="alert"
    >
      <div className="max-w-lg w-full bg-bg-secondary rounded-xl shadow-xl p-6 space-y-4">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-danger/10 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-danger"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">
            앗, 문제가 발생했습니다
          </h1>
          <p className="text-text-secondary">
            예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {showDetails && error && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-text-primary hover:text-primary transition-colors">
              개발자 정보 보기
            </summary>
            <div className="mt-3 p-4 bg-bg-tertiary rounded-lg space-y-2">
              <div>
                <p className="text-xs font-semibold text-danger mb-1">Error:</p>
                <p className="text-xs text-text-secondary font-mono break-all">
                  {error.toString()}
                </p>
              </div>
              {errorInfo?.componentStack && (
                <div>
                  <p className="text-xs font-semibold text-danger mb-1">
                    Component Stack:
                  </p>
                  <pre className="text-xs text-text-secondary font-mono overflow-x-auto whitespace-pre-wrap break-all">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={onReset}
          >
            다시 시도
          </Button>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => window.location.href = '/'}
          >
            홈으로
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * Page Error Fallback
 * 
 * Specialized error fallback for page-level errors.
 */

export const PageErrorFallback: React.FC<{
  error?: Error;
  onReset?: () => void;
}> = ({ error, onReset }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-danger/10 flex items-center justify-center">
            <svg
              className="h-10 w-10 text-danger"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-text-primary">
            페이지 로드 실패
          </h2>
          <p className="text-text-secondary">
            페이지를 불러오는 중 오류가 발생했습니다.
          </p>
          {error && process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-danger font-mono mt-2">
              {error.message}
            </p>
          )}
        </div>

        {onReset && (
          <Button variant="primary" size="md" onClick={onReset}>
            다시 시도
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Section Error Fallback
 * 
 * Specialized error fallback for section-level errors (smaller UI).
 */

export const SectionErrorFallback: React.FC<{
  onReset?: () => void;
}> = ({ onReset }) => {
  return (
    <div className="flex items-center justify-center p-8 bg-bg-secondary rounded-lg border border-border">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-danger/10 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-danger"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-text-primary">
            콘텐츠 로드 실패
          </p>
          <p className="text-xs text-text-secondary">
            이 섹션을 불러올 수 없습니다
          </p>
        </div>

        {onReset && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            다시 시도
          </Button>
        )}
      </div>
    </div>
  );
};
