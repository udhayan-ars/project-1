/**
 * Shared API Client for LMCYS
 * Provides resilient fetch execution, timeout handling, content-type verification,
 * and clear differentiation between network/proxy unreachable vs malformed server responses.
 */

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  rawText: string;
  error?: string;
  isNetworkError: boolean;
  isProxyError: boolean;
}

export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {},
  timeoutMs = 10000
): Promise<ApiResponse<T>> {
  const isDev = Boolean((import.meta as any).env?.DEV);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    const rawText = await res.text();

    // 1. Check for Vite Proxy error or Gateway failure
    if (res.status === 502 || res.status === 503 || res.status === 504) {
      let isProxy = false;
      let errorMsg = "Can't reach the Academy server. Check your connection and try again.";
      
      try {
        const parsed = JSON.parse(rawText);
        if (parsed.is_proxy_error || parsed.code === 'ECONNREFUSED') {
          isProxy = true;
        }
        if (parsed.error) {
          errorMsg = parsed.error;
        }
      } catch {
        isProxy = true;
      }

      if (isDev) {
        console.warn(`[API Client] Gateway/Proxy error (${res.status}) on ${url}:`, rawText);
      }

      return {
        ok: false,
        status: res.status,
        data: null,
        rawText,
        error: errorMsg,
        isNetworkError: true,
        isProxyError: isProxy
      };
    }

    // 2. Check for empty response body on non-204
    if (!rawText.trim()) {
      if (res.ok) {
        return {
          ok: true,
          status: res.status,
          data: null,
          rawText: '',
          isNetworkError: false,
          isProxyError: false
        };
      } else {
        return {
          ok: false,
          status: res.status,
          data: null,
          rawText: '',
          error: "Can't reach the Academy server. Empty response received.",
          isNetworkError: true,
          isProxyError: true
        };
      }
    }

    // 3. Check for HTML error response from proxy or web server
    if (contentType.includes('text/html') || rawText.trim().startsWith('<!DOCTYPE html>') || rawText.trim().startsWith('<html')) {
      if (isDev) {
        console.warn(`[API Client] Received HTML page instead of JSON from ${url}:`, rawText.substring(0, 300));
      }
      return {
        ok: false,
        status: res.status,
        data: null,
        rawText,
        error: "Can't reach the Academy server. Check your connection and try again.",
        isNetworkError: true,
        isProxyError: true
      };
    }

    // 4. Attempt JSON parsing
    let parsedData: any = null;
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseErr) {
      if (isDev) {
        console.error(`[API Client] Received invalid non-JSON payload from ${url} (Status ${res.status}):`, rawText);
      }
      return {
        ok: false,
        status: res.status,
        data: null,
        rawText,
        error: 'Received invalid response from the Academy server. Please try again.',
        isNetworkError: false,
        isProxyError: false
      };
    }

    // 5. Normal JSON Response (Success or API Error like 400/401/409)
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data: parsedData,
        rawText,
        error: parsedData?.error || parsedData?.message || `Request failed with status ${res.status}`,
        isNetworkError: false,
        isProxyError: false
      };
    }

    return {
      ok: true,
      status: res.status,
      data: parsedData,
      rawText,
      isNetworkError: false,
      isProxyError: false
    };

  } catch (err: any) {
    clearTimeout(timeoutId);
    if (isDev) {
      console.warn(`[API Client] Network exception on ${url}:`, err);
    }

    const isTimeout = err.name === 'AbortError';
    return {
      ok: false,
      status: 0,
      data: null,
      rawText: '',
      error: isTimeout
        ? "Request timed out. Can't reach the Academy server. Please try again."
        : "Can't reach the Academy server. Check your connection and try again.",
      isNetworkError: true,
      isProxyError: false
    };
  }
}
