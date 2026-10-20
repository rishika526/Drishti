import { BackendStatusState } from '../types';

export const API_BASE_URL: string = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Pings backend health endpoint with timeout and graceful fallback
 */
export async function checkBackendHealth(
  timeoutMs: number = 8000
): Promise<{ ok: boolean; latencyMs?: number; data?: any }> {
  if (!API_BASE_URL) {
    return { ok: false };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startTime = performance.now();

  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timer);
    const latencyMs = Math.round(performance.now() - startTime);

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, latencyMs, data };
    }
    return { ok: false, latencyMs };
  } catch (err) {
    clearTimeout(timer);
    return { ok: false };
  }
}
