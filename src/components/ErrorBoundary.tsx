// ============================================
// NULISIN - ERROR BOUNDARY COMPONENT
// Catches React render errors and reports to Sentry.
// ============================================

import React from 'react';
import { captureError } from '@/lib/sentry';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    captureError(error, {
      componentStack: errorInfo.componentStack?.slice(0, 500) || 'unknown',
      source: 'ErrorBoundary',
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Oops, terjadi kesalahan
            </h2>
            <p className="text-gray-600 mb-6">
              Sepertinya ada yang tidak beres. Silakan coba lagi atau muat ulang halaman.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Muat Ulang
              </Button>
              <Button
                onClick={this.handleReset}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
