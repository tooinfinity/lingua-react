import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';
import type { LinguaProps, TranslateFunction } from './types';

/**
 * Hook return type for useTranslations
 */
export interface UseTranslationsReturn {
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
}

/**
 * React hook for accessing Laravel Lingua translations in Inertia.js applications.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { __, locale, locales, direction, isRtl } = useTranslations();
 *   
 *   return (
 *     <div dir={direction}>
 *       <h1>{__('messages.welcome')}</h1>
 *       <p>{__('messages.greeting', { name: 'John' })}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTranslations(): UseTranslationsReturn {
  const { props } = usePage<{ lingua?: LinguaProps; [key: string]: unknown }>();
  const lingua = props.lingua;

  // Memoize translations to prevent unnecessary re-renders
  const translations = useMemo(
    () => lingua?.translations ?? {},
    [lingua?.translations]
  );

  /**
   * Translation function that supports:
   * - Dot notation for nested keys (e.g., 'messages.welcome')
   * - Laravel-style :placeholder replacements
   * - Returns the key if translation is not found
   */
  const __ = useCallback(
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
    locale: lingua?.locale ?? 'en',
    locales: lingua?.locales ?? ['en'],
    direction: lingua?.direction ?? 'ltr',
    isRtl: lingua?.isRtl ?? false,
    translations,
  };
}
