export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, url: string) {
    super(`Request failed with ${status}: ${url}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

type Params = Record<string, string | number | boolean | undefined>;

export const buildUrl = (base: string, params: Params = {}): string => {
  const url = new URL(base);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url.toString();
};

/** GET a JSON endpoint. Pass the query's AbortSignal so superseded requests are cancelled. */
export const getJson = async <T>(
  base: string,
  params: Params,
  init: RequestInit = {},
): Promise<T> => {
  const url = buildUrl(base, params);
  const res = await fetch(url, { ...init, headers: { Accept: 'application/json', ...init.headers } });
  if (!res.ok) throw new HttpError(res.status, url);
  return (await res.json()) as T;
};
