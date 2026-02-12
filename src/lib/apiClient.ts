const API_HOST = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');
const API_BASE_URL = `${API_HOST}/api`;

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const buildUrl = (path: string, params?: Record<string, string | number | boolean | null | undefined>) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

export const getStoredAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('auth_token');
};

export const setStoredAuthToken = (token: string | null) => {
  if (typeof window === 'undefined') return;

  if (!token) {
    window.localStorage.removeItem('auth_token');
    return;
  }

  window.localStorage.setItem('auth_token', token);
};

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
  auth?: boolean;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, auth = false, headers = {} } = options;

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getStoredAuthToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(buildUrl(path, params), {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload: unknown = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'msg' in payload
        ? String((payload as Record<string, unknown>).msg)
        : 'Request failed';

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
