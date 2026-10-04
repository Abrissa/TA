const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim();

/**
 * Centralized runtime configuration for frontend-to-backend communication.
 * Leave VITE_API_BASE_URL empty until a backend is available.
 */
export const env = {
  apiBaseUrl: apiBaseUrl.replace(/\/$/, ''),
} as const;
