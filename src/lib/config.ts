// Centralized application configuration and helpers
// Use only environment variables that are safe for the browser with NEXT_PUBLIC_

export const APP_CONFIG = {
  IS_DEV: process.env.NODE_ENV !== 'production',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || '', // empty means use Next.js rewrites/proxy
  API_PREFIX: '/api',
  DEFAULT_TIMEOUT: 10000,
} as const;

export type AppConfig = typeof APP_CONFIG;

// Build absolute API URL honoring base and prefix
export function makeApiUrl(path: string): string {
  const base = APP_CONFIG.API_BASE_URL || '';
  const prefix = APP_CONFIG.API_PREFIX;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // If path already includes the prefix, avoid duplicating
  const finalPath = normalizedPath.startsWith(prefix)
    ? normalizedPath
    : `${prefix}${normalizedPath}`;
  return `${base}${finalPath}`;
}
