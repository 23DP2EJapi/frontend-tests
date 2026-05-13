const normalizeApiUrl = (rawUrl?: string) => {
  const fallbackUrl = 'http://localhost:8000/api';
  const trimmedUrl = (rawUrl || fallbackUrl).trim();
  const withProtocol = /^https?:\/\//i.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;
  const parsed = new URL(withProtocol);
  const normalizedPath = parsed.pathname.replace(/\/+$/, '');
  const pathWithApi = normalizedPath === '' || normalizedPath === '/'
    ? '/api'
    : normalizedPath;

  return `${parsed.origin}${pathWithApi}`;
};

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);
const buildApiUrl = (path: string) =>
  `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const getToken = () => localStorage.getItem('auth_token');

const createHeaders = (isJson = false) => {
  const token = getToken();
  return {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(isJson ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseError = async (res: Response) => {
  const text = await res.text();
  if (!text) return { message: `Request failed with status ${res.status}` };
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const parseSuccess = async (res: Response) => {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const api = {
  async get(path: string) {
    const res = await fetch(buildApiUrl(path), {
      headers: createHeaders(),
    });
    if (!res.ok) throw await parseError(res);
    return parseSuccess(res);
  },
  async post(path: string, body: any) {
    const res = await fetch(buildApiUrl(path), {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await parseError(res);
    return parseSuccess(res);
  },
  async patch(path: string, body: any) {
    const res = await fetch(buildApiUrl(path), {
      method: 'PATCH',
      headers: createHeaders(true),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await parseError(res);
    return parseSuccess(res);
  },
  async delete(path: string) {
    const res = await fetch(buildApiUrl(path), {
      method: 'DELETE',
      headers: createHeaders(),
    });
    if (!res.ok) throw await parseError(res);
    return parseSuccess(res);
  },
  async getWithBody(path: string) {
    const res = await fetch(buildApiUrl(path), {
      method: 'GET',
      headers: createHeaders(true),
    });
    if (!res.ok) throw await parseError(res);
    return parseSuccess(res);
  },
};
