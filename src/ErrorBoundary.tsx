import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h1 className="text-2xl font-serif font-bold text-stone-900">Something went wrong</h1>
          <p className="text-stone-500">We encountered an unexpected error. Please try refreshing the page.</p>
          <Button onClick={() => window.location.reload()}>Refresh App</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
