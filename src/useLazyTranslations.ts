import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLinguaContext } from './LinguaProvider';
import type {
  TranslateFunction,
  UseLazyTranslationsOptions,
  UseLazyTranslationsReturn,
} from './types';

/**
 * Hook for lazy loading translation groups with automatic loading on mount.
 * 
 * This hook:
 * - Accepts groups to load automatically on mount
 * - Returns loading/error states
 * - Auto-loads specified groups when component mounts
 * - Supports both eager and lazy loading patterns
 * - Reloads translations when locale changes
 * 
 * @param options - Configuration options for lazy loading
 * @returns Translation utilities with loading states
 * 
 * @example
 * ```tsx
 * // Basic usage - auto-loads on mount
 * function Dashboard() {
 *   const { __, isLoading, isLoaded } = useLazyTranslations({ 
 *     groups: ['dashboard', 'settings'] 
 *   });
 *   
 *   if (isLoading) return <Loading />;
 *   
 *   return <h1>{__('dashboard.welcome')}</h1>;
 * }
 * 
 * // With lazy loading (manual trigger)
 * function Settings() {
 *   const { __, loadGroup, isGroupLoading } = useLazyTranslations({ 
 *     groups: [],
 *     eager: false 
 *   });
 *   
 *   const handleOpenSettings = () => {
 *     loadGroup('settings');
 *   };
 *   
 *   return <button onClick={handleOpenSettings}>Open Settings</button>;
 * }
 * 
 * // With error handling
 * function MyComponent() {
 *   const { __, error, reload } = useLazyTranslations({
 *     groups: ['messages'],
 *     onError: (err) => console.error('Failed to load translations:', err),
 *   });
 *   
 *   if (error) {
 *     return <button onClick={reload}>Retry</button>;
 *   }
 *   
 *   return <p>{__('messages.hello')}</p>;
 * }
 * ```
 */
export function useLazyTranslations(
  options: UseLazyTranslationsOptions
): UseLazyTranslationsReturn {
  const { groups, eager = true, onError } = options;

  const context = useLinguaContext();
  const {
    locale,
    locales,
    direction,
    isRtl,
    translations,
    loadGroup: contextLoadGroup,
    loadGroups: contextLoadGroups,
    isGroupLoaded,
    isGroupLoading,
  } = context;

  // Track error state
  const [error, setError] = useState<Error | null>(null);

  // Track the previous locale to detect changes
  const previousLocaleRef = useRef<string>(locale);

  // Track if initial load has been triggered
  const initialLoadTriggeredRef = useRef<boolean>(false);

  // Memoize groups array to prevent unnecessary effect triggers
  const groupsKey = groups.join(',');
  const memoizedGroups = useMemo(() => groups, [groupsKey]);

  /**
   * Load a single group with error handling
   */
  const loadGroup = useCallback(async (group: string): Promise<void> => {
    try {
      setError(null);
      await contextLoadGroup(group);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    }
  }, [contextLoadGroup, onError]);

  /**
   * Load multiple groups with error handling
   */
  const loadGroups = useCallback(async (groupsToLoad: string[]): Promise<void> => {
    try {
      setError(null);
      await contextLoadGroups(groupsToLoad);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    }
  }, [contextLoadGroups, onError]);

  /**
   * Reload all requested groups (force refresh by clearing cache first)
   */
  const reload = useCallback(async (): Promise<void> => {
    if (memoizedGroups.length === 0) return;
    
    // Note: This will re-fetch even if groups are already loaded
    // because the context's loadGroups checks loadedGroups state
    // For a true force refresh, we'd need to add a force parameter to context
    // For now, we just trigger the load again
    try {
      setError(null);
      await contextLoadGroups(memoizedGroups);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    }
  }, [memoizedGroups, contextLoadGroups, onError]);

  // Auto-load groups on mount (eager loading)
  useEffect(() => {
    if (!eager || memoizedGroups.length === 0) {
      return;
    }

    // Check if we need to load any groups
    const groupsToLoad = memoizedGroups.filter(
      group => !isGroupLoaded(group) && !isGroupLoading(group)
    );

    if (groupsToLoad.length > 0) {
      initialLoadTriggeredRef.current = true;
      loadGroups(groupsToLoad).catch(() => {
        // Error is already handled in loadGroups
      });
    }
  }, [eager, memoizedGroups, isGroupLoaded, isGroupLoading, loadGroups]);

  // Reload groups when locale changes
  useEffect(() => {
    if (previousLocaleRef.current !== locale) {
      previousLocaleRef.current = locale;
      
      // Clear error on locale change
      setError(null);

      // Reload groups if eager loading is enabled
      if (eager && memoizedGroups.length > 0) {
        loadGroups(memoizedGroups).catch(() => {
          // Error is already handled in loadGroups
        });
      }
    }
  }, [locale, eager, memoizedGroups, loadGroups]);

  // Calculate loading states
  const isLoading = useMemo(() => {
    return memoizedGroups.some(group => isGroupLoading(group));
  }, [memoizedGroups, isGroupLoading]);

  const isLoaded = useMemo(() => {
    return memoizedGroups.every(group => isGroupLoaded(group));
  }, [memoizedGroups, isGroupLoaded]);

  /**
   * Translation function that supports:
   * - Dot notation for nested keys (e.g., 'messages.welcome')
   * - Laravel-style :placeholder replacements
   * - Returns the key if translation is not found
   */
  const __: TranslateFunction = useCallback(
    (key: string, replacements?: Record<string, string | number>): string => {
      const keys = key.split('.');
      let value: unknown = translations;

      for (const k of keys) {
        if (value === undefined || value === null) break;
        if (typeof value === 'object' && value !== null) {
          value = (value as Record<string, unknown>)[k];
        } else {
          value = undefined;
          break;
        }
      }

      // Return the key if translation not found or not a string
      if (typeof value !== 'string') return key;

      // Apply Laravel-style :placeholder replacements
      if (replacements) {
        return Object.entries(replacements).reduce(
          (str, [k, v]) => str.replace(new RegExp(`:${k}`, 'g'), String(v)),
          value
        );
      }

      return value;
    },
    [translations]
  );

  return {
    __,
    locale,
    locales,
    direction,
    isRtl,
    translations,
    isLoading,
    isLoaded,
    error,
    loadGroup,
    loadGroups,
    reload,
  };
}

export default useLazyTranslations;
