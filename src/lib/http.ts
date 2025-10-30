import axios from 'axios';
import { APP_CONFIG, makeApiUrl } from './config';

// Token getter is injected lazily to avoid circular deps
type TokenGetter = () => string | null;
let getToken: TokenGetter = () => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem('ypr_token');
    } catch {
      return null;
    }
  }
  return null;
};

export function setTokenGetter(fn: TokenGetter) {
  getToken = fn;
}

export const http = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL || undefined, // we will send absolute URLs via makeApiUrl
  timeout: APP_CONFIG.DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header on requests in the browser
http.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }
  // Ensure URL is absolute and includes API prefix
  if (config.url) {
    // If URL already absolute (starts with http) assume caller provided it
    const isAbsolute = /^https?:\/\//i.test(config.url);
    if (!isAbsolute) {
      config.url = makeApiUrl(config.url);
    }
  }
  return config;
});

// Export helpers for typed requests if needed in future
export type Http = typeof http;
