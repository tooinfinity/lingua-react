import * as React from 'react';
import { router } from '@inertiajs/react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslations } from '../useTranslations';
import type { LocaleSwitcherProps } from '../types';

/**
 * Default locale display names with optional flag emojis
 */
const DEFAULT_LOCALE_NAMES: Record<string, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  pt: { name: 'Português', flag: '🇵🇹' },
  nl: { name: 'Nederlands', flag: '🇳🇱' },
  pl: { name: 'Polski', flag: '🇵🇱' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  ja: { name: '日本語', flag: '🇯🇵' },
  zh: { name: '中文', flag: '🇨🇳' },
  ko: { name: '한국어', flag: '🇰🇷' },
  ar: { name: 'العربية', flag: '🇸🇦' },
  hi: { name: 'हिन्दी', flag: '🇮🇳' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
  vi: { name: 'Tiếng Việt', flag: '🇻🇳' },
  th: { name: 'ไทย', flag: '🇹🇭' },
  sv: { name: 'Svenska', flag: '🇸🇪' },
  da: { name: 'Dansk', flag: '🇩🇰' },
  fi: { name: 'Suomi', flag: '🇫🇮' },
  no: { name: 'Norsk', flag: '🇳🇴' },
  cs: { name: 'Čeština', flag: '🇨🇿' },
  uk: { name: 'Українська', flag: '🇺🇦' },
  el: { name: 'Ελληνικά', flag: '🇬🇷' },
  he: { name: 'עברית', flag: '🇮🇱' },
  id: { name: 'Bahasa Indonesia', flag: '🇮🇩' },
  ms: { name: 'Bahasa Melayu', flag: '🇲🇾' },
  ro: { name: 'Română', flag: '🇷🇴' },
  hu: { name: 'Magyar', flag: '🇭🇺' },
  bg: { name: 'Български', flag: '🇧🇬' },
};

/**
 * Get display name for a locale
 */
function getLocaleName(
  localeCode: string,
  customNames?: Record<string, string>
): string {
  if (customNames?.[localeCode]) {
    return customNames[localeCode];
  }
  return DEFAULT_LOCALE_NAMES[localeCode]?.name ?? localeCode.toUpperCase();
}

/**
 * Get flag emoji for a locale
 */
function getLocaleFlag(localeCode: string): string {
  return DEFAULT_LOCALE_NAMES[localeCode]?.flag ?? '🌐';
}

/**
 * LocaleSwitcher component for switching between available locales
 * 
 * This component uses the useTranslations hook to get the current locale
 * and available locales, then provides a UI for switching between them.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <LocaleSwitcher />
 * 
 * // With custom endpoint and locale names
 * <LocaleSwitcher 
 *   endpoint="/api/locale"
 *   localeNames={{ en: 'English (US)', fr: 'French' }}
 *   showFlag
 * />
 * 
 * // Button variant
 * <LocaleSwitcher variant="buttons" showFlag />
 * ```
 */
export function LocaleSwitcher({
  endpoint = '/locale',
  className = '',
  showFlag = false,
  localeNames,
  variant = 'dropdown',
}: LocaleSwitcherProps) {
  const { locale: currentLocale, locales } = useTranslations();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  /**
   * Handle locale change via Inertia router
   */
  const handleLocaleChange = React.useCallback(
    (newLocale: string) => {
      if (newLocale === currentLocale) {
        setIsOpen(false);
        return;
      }

      router.post(
        endpoint,
        { locale: newLocale },
        {
          preserveState: true,
          preserveScroll: true,
          onSuccess: () => {
            setIsOpen(false);
          },
        }
      );
    },
    [currentLocale, endpoint]
  );

  /**
   * Handle click outside to close dropdown
   */
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          triggerRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          break;
        case 'Enter':
        case ' ':
          if (!isOpen) {
            event.preventDefault();
            setIsOpen(true);
          }
          break;
      }
    },
    [isOpen]
  );

  /**
   * Handle keyboard navigation within dropdown items
   */
  const handleItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent, localeCode: string, index: number) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          handleLocaleChange(localeCode);
          break;
        case 'ArrowDown':
          event.preventDefault();
          {
            const nextIndex = index + 1;
            if (nextIndex < locales.length) {
              const nextItem = dropdownRef.current?.querySelector(
                `[data-locale-index="${nextIndex}"]`
              ) as HTMLButtonElement;
              nextItem?.focus();
            }
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          {
            const prevIndex = index - 1;
            if (prevIndex >= 0) {
              const prevItem = dropdownRef.current?.querySelector(
                `[data-locale-index="${prevIndex}"]`
              ) as HTMLButtonElement;
              prevItem?.focus();
            } else {
              triggerRef.current?.focus();
              setIsOpen(false);
            }
          }
          break;
        case 'Escape':
          setIsOpen(false);
          triggerRef.current?.focus();
          break;
        case 'Tab':
          setIsOpen(false);
          break;
      }
    },
    [handleLocaleChange, locales.length]
  );

  // Don't render if only one locale is available
  if (locales.length <= 1) {
    return null;
  }

  /**
   * Render the buttons variant
   */
  if (variant === 'buttons') {
    return (
      <div
        className={`inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800 ${className}`}
        role="group"
        aria-label="Language selection"
      >
        {locales.map((localeCode) => {
          const isActive = localeCode === currentLocale;
          return (
            <button
              key={localeCode}
              type="button"
              onClick={() => handleLocaleChange(localeCode)}
              className={`
                inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium
                transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
                dark:focus:ring-slate-500 dark:focus:ring-offset-slate-800
                ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100'
                }
              `}
              aria-pressed={isActive}
              aria-label={`Switch to ${getLocaleName(localeCode, localeNames)}`}
            >
              {showFlag && (
                <span className="text-base" aria-hidden="true">
                  {getLocaleFlag(localeCode)}
                </span>
              )}
              <span>{getLocaleName(localeCode, localeNames)}</span>
            </button>
          );
        })}
      </div>
    );
  }

  /**
   * Render the dropdown variant (default)
   */
  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white
          px-3 py-2 text-sm font-medium text-slate-700 shadow-sm
          transition-all duration-150
          hover:bg-slate-50 hover:text-slate-900
          focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
          dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300
          dark:hover:bg-slate-700 dark:hover:text-slate-100
          dark:focus:ring-slate-500 dark:focus:ring-offset-slate-900
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Current language: ${getLocaleName(currentLocale, localeNames)}. Click to change language.`}
      >
        {showFlag ? (
          <span className="text-base" aria-hidden="true">
            {getLocaleFlag(currentLocale)}
          </span>
        ) : (
          <Globe className="h-4 w-4" aria-hidden="true" />
        )}
        <span>{getLocaleName(currentLocale, localeNames)}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute right-0 z-50 mt-2 min-w-[160px] origin-top-right
            rounded-md border border-slate-200 bg-white shadow-lg
            ring-1 ring-black ring-opacity-5
            dark:border-slate-700 dark:bg-slate-800
            animate-in fade-in-0 zoom-in-95
          `}
          role="listbox"
          aria-label="Available languages"
          aria-activedescendant={`locale-option-${currentLocale}`}
        >
          <div className="py-1">
            {locales.map((localeCode, index) => {
              const isActive = localeCode === currentLocale;
              return (
                <button
                  key={localeCode}
                  id={`locale-option-${localeCode}`}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  data-locale-index={index}
                  onClick={() => handleLocaleChange(localeCode)}
                  onKeyDown={(e) => handleItemKeyDown(e, localeCode, index)}
                  className={`
                    flex w-full items-center justify-between gap-2 px-3 py-2 text-sm
                    transition-colors duration-150
                    focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700
                    ${
                      isActive
                        ? 'bg-slate-50 text-slate-900 dark:bg-slate-700/50 dark:text-slate-100'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {showFlag && (
                      <span className="text-base" aria-hidden="true">
                        {getLocaleFlag(localeCode)}
                      </span>
                    )}
                    <span>{getLocaleName(localeCode, localeNames)}</span>
                  </span>
                  {isActive && (
                    <Check
                      className="h-4 w-4 text-slate-600 dark:text-slate-400"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LocaleSwitcher;
