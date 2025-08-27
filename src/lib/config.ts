// Server-side API configuration
// This file provides the correct API URL for server-side requests

export function getServerApiUrl(): string {
  // For server-side requests, use the backend port directly
  const backendPort = process.env.BACKEND_PORT || '8752';
  return `http://localhost:${backendPort}`;
}

export function getPublicApiUrl(): string {
  // For client-side requests, use the public API URL
  return import.meta.env.PUBLIC_API_URL || 'https://codersinflow.com';
}