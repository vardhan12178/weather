import { RefreshCw } from 'lucide-react';
import { PULL_THRESHOLD } from './usePullToRefresh';

/** Round spinner that follows the finger during pull-to-refresh */
const PullIndicator = ({ pull, refreshing }: { pull: number; refreshing: boolean }) => {
  if (pull <= 0 && !refreshing) return null;
  const progress = Math.min(1, pull / PULL_THRESHOLD);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+3.5rem)] z-20 flex justify-center"
      style={{ transform: `translateY(${pull - 40}px)`, opacity: progress }}
      role="status"
      aria-live="polite"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-surface-raised shadow-lg ring-1 ring-white/15">
        <RefreshCw
          size={18}
          className={refreshing ? 'animate-spin' : ''}
          style={refreshing ? undefined : { transform: `rotate(${progress * 270}deg)` }}
          aria-hidden="true"
        />
      </span>
      <span className="sr-only">{refreshing ? 'Refreshing forecast' : progress >= 1 ? 'Release to refresh' : 'Pull to refresh'}</span>
    </div>
  );
};

export default PullIndicator;
