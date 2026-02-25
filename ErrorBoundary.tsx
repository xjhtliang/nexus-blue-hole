
import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    
    // Log error to console
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card rounded-lg shadow-lg border border-border p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">页面加载失败</h2>
              <p className="text-gray-600 dark:text-muted-foreground mb-6">
                抱歉，加载页面时发生了错误。请稍后再试。
              </p>
              
              {this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-sm text-gray-500 dark:text-muted-foreground cursor-pointer mb-2">
                    错误详情
                  </summary>
                  <pre className="bg-gray-100 dark:bg-secondary p-3 rounded text-xs overflow-auto text-red-600 dark:text-red-400">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  刷新页面
                </button>
                <Link
                  to="/"
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="block w-full bg-gray-100 dark:bg-secondary text-gray-700 dark:text-foreground py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-secondary/80 transition-colors text-center"
                >
                  返回首页
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
