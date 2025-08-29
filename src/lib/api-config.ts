/**
 * API Configuration for multi-tenant setup
 * In production, uses relative /api path which gets proxied to backend
 * In development, uses PUBLIC_API_URL from environment
 */

export function getApiUrl(): string {
  // In production, use relative path (will be proxied by server)
  if (import.meta.env.PROD) {
    return '/api';
  }
  
  // In development, use environment variable or fallback
  return import.meta.env.PUBLIC_API_URL || 'http://127.0.0.1:3001/api';
}

export function getFullApiUrl(path: string): string {
  const baseUrl = getApiUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Remove /api from path if baseUrl already includes it
  const cleanPath = normalizedPath.replace(/^\/api/, '');
  return `${baseUrl}${cleanPath}`;
}