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
      <div className="grid min-h-dvh place-items-center bg-linear-to-b from-[#1a5bbd] to-[#3f86d6] px-6 text-center">
        <div className="max-w-sm">
          <h1 className="text-title font-semibold">Something went wrong</h1>
          <p className="mt-2 text-body text-white/85">The forecast couldn&apos;t be displayed. Reloading usually fixes it.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 min-h-12 rounded-full bg-white px-6 font-semibold text-slate-900 transition-colors hover:bg-white/90"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
