// All timestamps from the API are true UTC instants (unix seconds). To show
// the wall-clock time *at the searched location* (not the viewer's browser),
// format them in the location's IANA time zone, e.g. "Asia/Kolkata".
export const formatInZone = (unixSeconds, timeZone, options = {}) => {
  const date = new Date(unixSeconds * 1000);
  try {
    return date.toLocaleString([], { ...options, timeZone });
  } catch {
    // Unknown/invalid zone name — fall back to the viewer's zone
    return date.toLocaleString([], options);
  }
};

export const formatHour = (unixSeconds, timeZone) =>
  formatInZone(unixSeconds, timeZone, { hour: 'numeric', hour12: true });

export const formatClock = (unixSeconds, timeZone) =>
  formatInZone(unixSeconds, timeZone, { hour: '2-digit', minute: '2-digit', hour12: true });

export const formatWeekday = (unixSeconds, timeZone) =>
  formatInZone(unixSeconds, timeZone, { weekday: 'short' });

export const formatShortDate = (unixSeconds, timeZone) =>
  formatInZone(unixSeconds, timeZone, { month: 'short', day: 'numeric' });

export const formatLongDate = (unixSeconds, timeZone) =>
  formatInZone(unixSeconds, timeZone, { weekday: 'long', month: 'short', day: 'numeric' });
