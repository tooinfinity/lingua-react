import type {
  TranslationGroupResponse,
  TranslationsResponse,
  AvailableGroupsResponse,
  LazyLoadOptions,
} from './types';

/**
 * Default base URL for API endpoints
 */
const DEFAULT_BASE_URL = '';

/**
 * Default CSS selector for CSRF token meta tag
 */
const DEFAULT_CSRF_SELECTOR = 'meta[name="csrf-token"]';

/**
 * Build the full URL for an endpoint
 */
function buildUrl(endpoint: string, options?: LazyLoadOptions): string {
  const baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;
  return `${baseUrl}${endpoint}`;
}

/**
 * Get CSRF token from meta tag, cookie, or options
 * 
 * @param options - Optional configuration with CSRF settings
 * @returns The CSRF token string or null if not found
 * 
 * @example
 * ```tsx
 * // Auto-detect from meta tag
 * const token = getCSRFToken();
 * 
 * // Use custom selector
 * const token = getCSRFToken({ csrfSelector: 'meta[name="X-CSRF-TOKEN"]' });
 * 
 * // Use manual token
 * const token = getCSRFToken({ csrfToken: 'my-token' });
 * ```
 */
export function getCSRFToken(options?: LazyLoadOptions): string | null {
  // Use manually provided token first
  if (options?.csrfToken) {
    return options.csrfToken;
  }

  // Only access document in browser environment
  if (typeof document === 'undefined') {
    return null;
  }

  // Try to get from meta tag
  const selector = options?.csrfSelector ?? DEFAULT_CSRF_SELECTOR;
  const meta = document.querySelector(selector);
  if (meta) {
    const content = meta.getAttribute('content');
    if (content) {
      return content;
    }
  }

  // Try to get from cookie (Laravel's XSRF-TOKEN cookie)
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'XSRF-TOKEN' && value) {
      // Laravel's XSRF-TOKEN is URL encoded
      return decodeURIComponent(value);
    }
  }

  return null;
}

/**
 * Build headers for fetch requests, including CSRF token for POST requests
 */
function buildHeaders(
  method: 'GET' | 'POST',
  options?: LazyLoadOptions
): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options?.headers ?? {}),
  };

  if (method === 'POST') {
    headers['Content-Type'] = 'application/json';
    
    const csrfToken = getCSRFToken(options);
    if (csrfToken) {
      headers['X-CSRF-TOKEN'] = csrfToken;
      // Also set X-XSRF-TOKEN for Laravel Sanctum compatibility
      headers['X-XSRF-TOKEN'] = csrfToken;
    }
  }

  return headers;
}

/**
 * Fetch a single translation group from the server.
 * 
 * Uses the Laravel Lingua endpoint: GET /lingua/translations/{group}
 * 
 * @param group - The translation group name (e.g., 'messages', 'auth')
 * @param options - Optional configuration
 * @returns Promise resolving to the translation group data
 * 
 * @example
 * ```tsx
 * const { translations } = await fetchTranslationGroup('dashboard');
 * // translations = { welcome: 'Welcome to dashboard', ... }
 * ```
 */
export async function fetchTranslationGroup(
  group: string,
  options?: LazyLoadOptions
): Promise<TranslationGroupResponse> {
  const url = buildUrl(`/lingua/translations/${encodeURIComponent(group)}`, options);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders('GET', options),
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch translation group '${group}': ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch multiple translation groups from the server.
 * 
 * Uses the Laravel Lingua endpoint: POST /lingua/translations
 * 
 * @param groups - Array of translation group names to fetch
 * @param options - Optional configuration
 * @returns Promise resolving to the translations data
 * 
 * @example
 * ```tsx
 * const { translations } = await fetchTranslationGroups(['auth', 'messages', 'dashboard']);
 * // translations = { auth: {...}, messages: {...}, dashboard: {...} }
 * ```
 */
export async function fetchTranslationGroups(
  groups: string[],
  options?: LazyLoadOptions
): Promise<TranslationsResponse> {
  if (groups.length === 0) {
    return { locale: '', translations: {} };
  }

  const url = buildUrl('/lingua/translations', options);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders('POST', options),
    credentials: 'same-origin',
    body: JSON.stringify({ groups }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch translation groups: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch the list of available translation groups from the server.
 * 
 * Uses the Laravel Lingua endpoint: GET /lingua/groups
 * 
 * @param options - Optional configuration
 * @returns Promise resolving to the available groups data
 * 
 * @example
 * ```tsx
 * const { groups } = await fetchAvailableGroups();
 * // groups = ['auth', 'messages', 'validation', ...]
 * ```
 */
export async function fetchAvailableGroups(
  options?: LazyLoadOptions
): Promise<AvailableGroupsResponse> {
  const url = buildUrl('/lingua/groups', options);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders('GET', options),
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch available groups: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a lazy loading helper with pre-configured options.
 * 
 * Useful when you need to use a custom base URL or CSRF configuration for all requests.
 * 
 * @param options - Configuration options to apply to all requests
 * @returns Object with lazy loading functions
 * 
 * @example
 * ```tsx
 * const lingua = createLazyLoader({ 
 *   baseUrl: '/api',
 *   csrfToken: 'my-token'
 * });
 * const { translations } = await lingua.fetchGroup('messages');
 * ```
 */
export function createLazyLoader(options: LazyLoadOptions) {
  return {
    /**
     * Fetch a single translation group
     */
    fetchGroup: (group: string) => fetchTranslationGroup(group, options),
    
    /**
     * Fetch multiple translation groups
     */
    fetchGroups: (groups: string[]) => fetchTranslationGroups(groups, options),
    
    /**
     * Fetch available translation groups
     */
    fetchAvailable: () => fetchAvailableGroups(options),

    /**
     * Get the current CSRF token
     */
    getCSRFToken: () => getCSRFToken(options),
  };
}
