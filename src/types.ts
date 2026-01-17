export interface LinguaProps {
  locale: string;
  locales: string[];
  translations: Record<string, any>;
}

export type TranslateFunction = (key: string, replacements?: Record<string, string | number>) => string;

/**
 * Props for the LocaleSwitcher component
 */
export interface LocaleSwitcherProps {
  /**
   * Custom endpoint for locale switching
   * @default '/locale'
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
