import { useEffect, useState, useRef } from 'react';
import { API_BASE_URL, checkBackendHealth } from '../lib/api';

export type BackendStatusText = 'Offline - running in local mode' | 'Waking backend...' | 'Backend online';

export interface UseBackendStatusReturn {
  status: 'offline' | 'waking' | 'online';
  statusText: BackendStatusText;
  latencyMs?: number;
  apiUrl: string;
  recheck: () => void;
}

export function useBackendStatus(): UseBackendStatusReturn {
  const [status, setStatus] = useState<'offline' | 'waking' | 'online'>('offline');
  const [statusText, setStatusText] = useState<BackendStatusText>('Offline - running in local mode');
  const [latencyMs, setLatencyMs] = useState<number | undefined>(undefined);
  const attemptRef = useRef(0);
  const timeoutRef = useRef<any>(null);

  const check = async () => {
    if (!API_BASE_URL) {
      setStatus('offline');
      setStatusText('Offline - running in local mode');
      return;
    }

    if (attemptRef.current === 0) {
      setStatus('waking');
      setStatusText('Waking backend...');
    }

    const res = await checkBackendHealth(8000);

    if (res.ok) {
      setStatus('online');
      setStatusText('Backend online');
      setLatencyMs(res.latencyMs);
    } else {
      attemptRef.current += 1;
      // If we haven't reached 4 retries, keep trying with exponential backoff for Render cold start
      if (attemptRef.current <= 4) {
        setStatus('waking');
        setStatusText('Waking backend...');
        const delay = Math.min(12000, 3000 * Math.pow(1.5, attemptRef.current - 1));
        timeoutRef.current = setTimeout(check, delay);
      } else {
        setStatus('offline');
        setStatusText('Offline - running in local mode');
      }
    }
  };

  useEffect(() => {
    check();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    status,
    statusText,
    latencyMs,
    apiUrl: API_BASE_URL,
    recheck: () => {
      attemptRef.current = 0;
      check();
    },
  };
}
