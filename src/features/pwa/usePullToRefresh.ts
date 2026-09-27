import { useEffect, useRef, useState } from 'react';

export const PULL_THRESHOLD = 72;
const MAX_PULL = 110;
const RESISTANCE = 0.5;

/**
 * Pull down at the top of the page to refresh (touch screens). Installed PWAs
 * don't get the browser's own pull-to-refresh, and in a browser tab we turn
 * the native one off (overscroll-behavior) so this one runs instead.
 */
export const usePullToRefresh = (onRefresh: () => Promise<unknown>, enabled: boolean) => {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const pullRef = useRef(0);
  const refreshRef = useRef(onRefresh);

  useEffect(() => {
    refreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    if (!enabled) return;
    let start: { x: number; y: number } | null = null;
    let busy = false;

    const set = (v: number) => {
      pullRef.current = v;
      setPull(v);
    };

    const onStart = (e: TouchEvent) => {
      // Only from the very top, never while a sheet is open or a refresh is running
      if (busy || window.scrollY > 0 || document.querySelector('dialog[open]') || e.touches.length !== 1) return;
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onMove = (e: TouchEvent) => {
      if (!start) return;
      const dx = e.touches[0].clientX - start.x;
      const dy = e.touches[0].clientY - start.y;
      // A sideways swipe (e.g. the hourly strip) or scrolling up isn't a pull
      if (dy <= 0 || Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > Math.abs(dy)) start = null;
        set(0);
        return;
      }
      set(Math.min(MAX_PULL, dy * RESISTANCE));
    };

    const onEnd = async () => {
      if (!start) return;
      start = null;
      if (pullRef.current < PULL_THRESHOLD) {
        set(0);
        return;
      }
      busy = true;
      setRefreshing(true);
      set(PULL_THRESHOLD);
      try {
        await refreshRef.current();
      } finally {
        busy = false;
        setRefreshing(false);
        set(0);
      }
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [enabled]);

  return { pull, refreshing };
};
