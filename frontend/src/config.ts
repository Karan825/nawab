/**
 * Centralized API configuration supporting both local Vite proxy development
 * and cross-origin production deployments (Render, GitHub Pages, Vercel).
 */
const getInitialApiBase = (): string => {
  // 1. Explicit Vite env variables if supplied
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }

  // 2. Production hosted domains: automatically route to Render backend
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname.includes('github.io') ||
      window.location.hostname.includes('vercel.app') ||
      window.location.hostname.includes('netlify.app'))
  ) {
    return 'https://nawab-backend.onrender.com';
  }

  // 3. Localhost development: uses relative URL via Vite proxy
  return '';
};

export const API_BASE = getInitialApiBase();

export const apiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
};

export const wsUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (API_BASE.startsWith('http://')) {
    return API_BASE.replace('http://', 'ws://') + cleanPath;
  }
  if (API_BASE.startsWith('https://')) {
    return API_BASE.replace('https://', 'wss://') + cleanPath;
  }
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}${cleanPath}`;
  }
  return `ws://127.0.0.1:8000${cleanPath}`;
};
