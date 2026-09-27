import { useEffect, useState } from 'react';

const nowSeconds = () => Math.floor(Date.now() / 1000);

/** Current unix time in seconds, re-rendering every `intervalMs` (default 1 min). */
export const useNow = (intervalMs = 60_000): number => {
  const [now, setNow] = useState(nowSeconds);

  useEffect(() => {
    const id = setInterval(() => setNow(nowSeconds()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
};
