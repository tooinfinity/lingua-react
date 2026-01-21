/**
 * The lingua data structure shared via Inertia props
 */
export interface LinguaProps {
  locale: string;
  locales: string[];
  translations: Record<string, Record<string, string | object>>;
  direction: 'ltr' | 'rtl';
  isRtl: boolean;
}

/**
 * The wrapper structure for Inertia page props
 */
export interface LinguaPageProps {
  lingua: LinguaProps;
  [key: string]: unknown;
}

/**
 * Translation function type - uses Laravel's __ convention
 */
export type TranslateFunction = (key: string, replacements?: Record<string, string | number>) => string;

/**
 * Response from fetching a single translation group
 */
export interface TranslationGroupResponse {
  group: string;
  locale: string;
  translations: Record<string, string | object>;
}

/**
 * Response from fetching multiple translation groups
 */
export interface TranslationsResponse {
  locale: string;
  translations: Record<string, Record<string, string | object>>;
}

/**
 * Response from fetching available groups
 */
export interface AvailableGroupsResponse {
  locale: string;
  groups: string[];
}

/**
 * Options for lazy loading functions
 */
export interface LazyLoadOptions {
  /**
   * Base URL for the API endpoints
   * @default ''
   */
  baseUrl?: string;

  /**
   * Manual CSRF token to use for POST requests
   * If not provided, will attempt to extract from meta tag
   */
  csrfToken?: string;

  /**
   * CSS selector for the CSRF token meta tag
   * @default 'meta[name="csrf-token"]'
   */
  csrfSelector?: string;

  /**
   * Additional headers to include in requests
   */
  headers?: Record<string, string>;
}

/**
 * Props for the LocaleSwitcher component
 */
export interface LocaleSwitcherProps {
  /**
   * Custom endpoint for locale switching
   * @default '/lingua/locale'
   */
  endpoint?: string;

  /**
   * Additional CSS classes to apply to the root element
   */
  className?: string;

  /**
   * Whether to show flag emojis alongside locale names
   * @default false
   */
  showFlag?: boolean;

  /**
   * Custom display names for locales
   * @example { en: 'English (US)', fr: 'Français' }
   */
  localeNames?: Record<string, string>;

  /**
   * Display variant for the locale switcher
   * - 'dropdown': Shows a dropdown menu (default)
   * - 'buttons': Shows inline buttons for each locale
   * @default 'dropdown'
   */
  variant?: 'dropdown' | 'buttons';
}

/**
 * Context value for LinguaProvider
 */
export interface LinguaContextValue {
  /** Current locale */
  locale: string;
  /** List of supported locales */
  locales: string[];
  /** Text direction ('ltr' or 'rtl') */
  direction: 'ltr' | 'rtl';
  /** Whether current locale is RTL */
  isRtl: boolean;
  /** All loaded translations (merged from Inertia props and lazy-loaded) */
  translations: Record<string, Record<string, string | object>>;
  /** Set of groups that have been loaded */
  loadedGroups: Set<string>;
  /** Set of groups currently being loaded */
  loadingGroups: Set<string>;
  /** Load a single translation group */
  loadGroup: (group: string) => Promise<void>;
  /** Load multiple translation groups */
  loadGroups: (groups: string[]) => Promise<void>;
  /** Check if a group has been loaded */
  isGroupLoaded: (group: string) => boolean;
  /** Check if a group is currently loading */
  isGroupLoading: (group: string) => boolean;
}

/**
 * Props for LinguaProvider component
 */
export interface LinguaProviderProps {
  /** React children */
  children: React.ReactNode;
  /** Optional lazy loading configuration */
  lazyLoadOptions?: LazyLoadOptions;
  /** 
   * Initial groups to mark as loaded (typically groups included in initial Inertia props)
   * If not provided, will auto-detect from initial translations
   */
  initialLoadedGroups?: string[];
}

/**
 * Options for useLazyTranslations hook
 */
export interface UseLazyTranslationsOptions {
  /** Translation groups to auto-load on mount */
  groups: string[];
  /** 
   * Whether to load groups immediately on mount
   * @default true
   */
  eager?: boolean;
  /** Callback when an error occurs during loading */
  onError?: (error: Error) => void;
}

/**
 * Return type for useLazyTranslations hook
 */
export interface UseLazyTranslationsReturn {
  /** Translation function - uses Laravel's __ convention */
  __: TranslateFunction;
  /** Current locale */
  locale: string;
  /** List of supported locales */
  locales: string[];
  /** Text direction ('ltr' or 'rtl') */
  direction: 'ltr' | 'rtl';
  /** Whether current locale is RTL */
  isRtl: boolean;
  /** Raw translations object */
  translations: Record<string, Record<string, string | object>>;
  /** Whether any requested groups are currently loading */
  isLoading: boolean;
  /** Whether all requested groups have been loaded */
  isLoaded: boolean;
  /** Last error that occurred during loading, if any */
  error: Error | null;
  /** Load a single translation group */
  loadGroup: (group: string) => Promise<void>;
  /** Load multiple translation groups */
  loadGroups: (groups: string[]) => Promise<void>;
  /** Reload all requested groups (force refresh) */
  reload: () => Promise<void>;
}
