const API_HOST = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
const API_BASE_URL = API_HOST ? `${API_HOST}/api` : '/api';
export class ApiError extends Error {
    constructor(message, status, details = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.details = details;
    }
}
const buildUrl = (path, params) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const basePath = `${API_BASE_URL}${normalizedPath}`;
    const searchParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '')
                return;
            searchParams.set(key, String(value));
        });
    }
    const query = searchParams.toString();
    return query ? `${basePath}?${query}` : basePath;
};
export const getStoredAuthToken = () => {
    if (typeof window === 'undefined')
        return null;
    return window.localStorage.getItem('auth_token');
};
export const setStoredAuthToken = (token) => {
    if (typeof window === 'undefined')
        return;
    if (!token) {
        window.localStorage.removeItem('auth_token');
        return;
    }
    window.localStorage.setItem('auth_token', token);
};
export async function apiRequest(path, options = {}) {
    const { method = 'GET', body, params, auth = false, headers = {} } = options;
    const requestHeaders = {
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
    const payload = isJson ? await response.json() : await response.text();
    if (!response.ok) {
        const message = typeof payload === 'object' && payload !== null && 'msg' in payload
            ? String(payload.msg)
            : 'Request failed';
        throw new ApiError(message, response.status, payload);
    }
    return payload;
}
