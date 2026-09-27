import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Render this instead of the full-page message (e.g. `null` for decorative parts) */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

// Catches render errors so one bad value can't blank the whole page.
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unexpected UI error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;

    return (
      <div className="min-h-screen grid place-items-center bg-linear-to-b from-sky-100 via-blue-50 to-indigo-100 px-6 text-center">
        <div className="max-w-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-600">
            The forecast couldn&apos;t be displayed. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 min-h-11 px-6 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-soft transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
