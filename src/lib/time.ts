// All timestamps from the API are true UTC instants (unix seconds). To show
// the wall-clock time *at the searched location* (not the viewer's browser),
// format them in the location's IANA time zone, e.g. "Asia/Kolkata".
export const formatInZone = (
  unixSeconds: number,
  timeZone: string | undefined,
  options: Intl.DateTimeFormatOptions = {},
): string => {
  const date = new Date(unixSeconds * 1000);
  try {
    return date.toLocaleString([], { ...options, timeZone });
  } catch {
    // Unknown/invalid zone name — fall back to the viewer's zone
    return date.toLocaleString([], options);
  }
};

export const formatHour = (t: number, tz?: string) =>
  formatInZone(t, tz, { hour: 'numeric', hour12: true });

export const formatClock = (t: number, tz?: string) =>
  formatInZone(t, tz, { hour: 'numeric', minute: '2-digit', hour12: true });

export const formatWeekday = (t: number, tz?: string) => formatInZone(t, tz, { weekday: 'short' });

export const formatShortDate = (t: number, tz?: string) =>
  formatInZone(t, tz, { month: 'short', day: 'numeric' });

export const formatLongDate = (t: number, tz?: string) =>
  formatInZone(t, tz, { weekday: 'long', month: 'short', day: 'numeric' });

/** Hour of day (0–23) at the location */
export const localHour = (t: number, tz?: string): number =>
  Number(formatInZone(t, tz, { hour: 'numeric', hourCycle: 'h23' })) % 24;

/** Month (1–12) at the location */
export const localMonth = (t: number, tz?: string): number =>
  Number(formatInZone(t, tz, { month: 'numeric' }));
