import * as React from 'react';
import { usePage } from '@inertiajs/react';
import { fetchTranslationGroups } from './lazyLoading';
import type {
  LinguaProps,
  LinguaContextValue,
  LinguaProviderProps,
  LazyLoadOptions,
} from './types';

/**
 * React context for Lingua translations
 */
const LinguaContext = React.createContext<LinguaContextValue | null>(null);

/**
 * Hook to access the Lingua context
 * 
 * @throws Error if used outside of LinguaProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { locale, loadGroup, isGroupLoaded } = useLinguaContext();
 *   
 *   useEffect(() => {
 *     if (!isGroupLoaded('dashboard')) {
 *       loadGroup('dashboard');
 *     }
 *   }, []);
 *   
 *   return <div>Current locale: {locale}</div>;
 * }
 * ```
 */
export function useLinguaContext(): LinguaContextValue {
  const context = React.useContext(LinguaContext);
  if (!context) {
    throw new Error('useLinguaContext must be used within a LinguaProvider');
  }
  return context;
}

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Extract group names from translations object
 */
function extractGroupNames(translations: Record<string, Record<string, string | object>>): string[] {
  return Object.keys(translations);
}

/**
 * LinguaProvider component that manages global translation state
 * 
 * This provider:
 * - Wraps your app and manages global translation state
 * - Automatically merges lazy-loaded translations with initial Inertia props
 * - Provides loading states for translation groups
 * - Caches loaded groups to prevent duplicate requests
 * - Re-fetches translations when locale changes
 * 
 * @example
 * ```tsx
 * // In your app's root component
 * import { LinguaProvider } from '@tooinfinity/lingua-react';
 * 
 * function App({ children }) {
 *   return (
 *     <LinguaProvider>
 *       {children}
 *     </LinguaProvider>
 *   );
 * }
 * 
 * // With custom options
 * <LinguaProvider 
 *   lazyLoadOptions={{ baseUrl: '/api' }}
 *   initialLoadedGroups={['common', 'auth']}
 * >
 *   {children}
 * </LinguaProvider>
 * ```
 */
export function LinguaProvider({
  children,
  lazyLoadOptions,
  initialLoadedGroups,
}: LinguaProviderProps): React.ReactElement {
  const { props } = usePage<{ lingua?: LinguaProps; [key: string]: unknown }>();
  const lingua = props.lingua;

  // Track the current locale for change detection
  const currentLocale = lingua?.locale ?? 'en';
  const previousLocaleRef = React.useRef<string>(currentLocale);

  // Initial translations from Inertia props
  const initialTranslations = React.useMemo(
    () => lingua?.translations ?? {},
    [lingua?.translations]
  );

  // State for lazy-loaded translations (merged with initial)
  const [mergedTranslations, setMergedTranslations] = React.useState<
    Record<string, Record<string, string | object>>
  >(initialTranslations);

  // Track loaded and loading groups
  const [loadedGroups, setLoadedGroups] = React.useState<Set<string>>(() => {
    if (initialLoadedGroups) {
      return new Set(initialLoadedGroups);
    }
    // Auto-detect initial groups from translations
    return new Set(extractGroupNames(initialTranslations));
  });

  const [loadingGroups, setLoadingGroups] = React.useState<Set<string>>(new Set());

  // Cache for pending requests to prevent duplicate fetches
  const pendingRequestsRef = React.useRef<Map<string, Promise<void>>>(new Map());

  // Store lazy load options in a ref to avoid re-creating functions
  const optionsRef = React.useRef<LazyLoadOptions | undefined>(lazyLoadOptions);
  React.useEffect(() => {
    optionsRef.current = lazyLoadOptions;
  }, [lazyLoadOptions]);

  // Reset state when locale changes
  React.useEffect(() => {
    if (previousLocaleRef.current !== currentLocale) {
      previousLocaleRef.current = currentLocale;
      
      // Clear lazy-loaded translations and reset to initial
      setMergedTranslations(initialTranslations);
      
      // Reset loaded groups to only include initial ones
      const newLoadedGroups = initialLoadedGroups
        ? new Set(initialLoadedGroups)
        : new Set(extractGroupNames(initialTranslations));
      setLoadedGroups(newLoadedGroups);
      
      // Clear loading state
      setLoadingGroups(new Set());
      
      // Clear pending requests
      pendingRequestsRef.current.clear();
    }
  }, [currentLocale, initialTranslations, initialLoadedGroups]);

  // Update merged translations when initial translations change
  React.useEffect(() => {
    setMergedTranslations(prev => ({
      ...initialTranslations,
      ...prev,
    }));
  }, [initialTranslations]);

  /**
   * Load multiple translation groups
   */
  const loadGroups = React.useCallback(async (groups: string[]): Promise<void> => {
    // Only run in browser environment
    if (!isBrowser()) {
      return;
    }

    // Filter out already loaded or currently loading groups
    const groupsToLoad = groups.filter(
      group => !loadedGroups.has(group) && !loadingGroups.has(group)
    );

    if (groupsToLoad.length === 0) {
      return;
    }

    // Check for existing pending requests and deduplicate
    const newGroupsToLoad: string[] = [];
    const existingPromises: Promise<void>[] = [];

    for (const group of groupsToLoad) {
      const pending = pendingRequestsRef.current.get(group);
      if (pending) {
        existingPromises.push(pending);
      } else {
        newGroupsToLoad.push(group);
      }
    }

    if (newGroupsToLoad.length === 0) {
      // All groups are already being fetched, wait for them
      await Promise.all(existingPromises);
      return;
    }

    // Mark groups as loading
    setLoadingGroups(prev => {
      const next = new Set(prev);
      newGroupsToLoad.forEach(g => next.add(g));
      return next;
    });

    // Create the fetch promise
    const fetchPromise = (async () => {
      try {
        const response = await fetchTranslationGroups(newGroupsToLoad, optionsRef.current);

        // Merge new translations
        setMergedTranslations(prev => ({
          ...prev,
          ...response.translations,
        }));

        // Mark groups as loaded
        setLoadedGroups(prev => {
          const next = new Set(prev);
          newGroupsToLoad.forEach(g => next.add(g));
          return next;
        });
      } finally {
        // Remove from loading state
        setLoadingGroups(prev => {
          const next = new Set(prev);
          newGroupsToLoad.forEach(g => next.delete(g));
          return next;
        });

        // Clean up pending requests
        newGroupsToLoad.forEach(g => {
          pendingRequestsRef.current.delete(g);
        });
      }
    })();

    // Store the promise for each group
    newGroupsToLoad.forEach(group => {
      pendingRequestsRef.current.set(group, fetchPromise);
    });

    // Wait for all promises (existing + new)
    await Promise.all([...existingPromises, fetchPromise]);
  }, [loadedGroups, loadingGroups]);

  /**
   * Load a single translation group
   */
  const loadGroup = React.useCallback(async (group: string): Promise<void> => {
    return loadGroups([group]);
  }, [loadGroups]);

  /**
   * Check if a group has been loaded
   */
  const isGroupLoaded = React.useCallback((group: string): boolean => {
    return loadedGroups.has(group);
  }, [loadedGroups]);

  /**
   * Check if a group is currently loading
   */
  const isGroupLoading = React.useCallback((group: string): boolean => {
    return loadingGroups.has(group);
  }, [loadingGroups]);

  // Build context value
  const contextValue = React.useMemo<LinguaContextValue>(() => ({
    locale: currentLocale,
    locales: lingua?.locales ?? ['en'],
    direction: lingua?.direction ?? 'ltr',
    isRtl: lingua?.isRtl ?? false,
    translations: mergedTranslations,
    loadedGroups,
    loadingGroups,
    loadGroup,
    loadGroups,
    isGroupLoaded,
    isGroupLoading,
  }), [
    currentLocale,
    lingua?.locales,
    lingua?.direction,
    lingua?.isRtl,
    mergedTranslations,
    loadedGroups,
    loadingGroups,
    loadGroup,
    loadGroups,
    isGroupLoaded,
    isGroupLoading,
  ]);

  return (
    <LinguaContext.Provider value={contextValue}>
      {children}
    </LinguaContext.Provider>
  );
}

export default LinguaProvider;
