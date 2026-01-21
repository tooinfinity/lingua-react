# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-01-21

### Added

- **LinguaProvider** - React context provider for global translation state management
  - Wraps your app to enable automatic lazy loading features
  - Automatically merges lazy-loaded translations with initial Inertia props
  - Caches loaded groups to prevent duplicate requests
  - Re-fetches translations when locale changes
  - Exposes `useLinguaContext()` hook for direct context access

- **useLazyTranslations Hook** - Automatic lazy loading with loading states
  - `groups` option - Specify translation groups to auto-load on mount
  - `eager` option - Control automatic vs manual loading (default: true)
  - `onError` callback - Handle loading errors
  - Returns `isLoading`, `isLoaded`, `error`, `reload()`, `loadGroup()`, `loadGroups()`
  - Automatically reloads translations when locale changes

- **Lazy Loading Functions** - Low-level functions for manual control
  - `fetchTranslationGroup(group)` - Fetch single group via `GET /lingua/translations/{group}`
  - `fetchTranslationGroups(groups)` - Fetch multiple groups via `POST /lingua/translations`
  - `fetchAvailableGroups()` - Get available groups via `GET /lingua/groups`
  - `createLazyLoader(options)` - Factory function with custom base URL and headers

- **CSRF Token Support** - Automatic CSRF handling for POST requests
  - `getCSRFToken()` - Extract CSRF token from meta tag or cookie
  - Automatically includes `X-CSRF-TOKEN` header in POST requests
  - Supports Laravel's `<meta name="csrf-token">` and `XSRF-TOKEN` cookie
  - Configurable via `csrfToken`, `csrfSelector`, and `headers` options

- **New TypeScript Types**
  - `LinguaContextValue` - Context value interface
  - `LinguaProviderProps` - Provider component props
  - `UseLazyTranslationsOptions` - Hook options interface
  - `UseLazyTranslationsReturn` - Hook return type
  - `LinguaPageProps` - Wrapper type for Inertia page props
  - `TranslationGroupResponse`, `TranslationsResponse`, `AvailableGroupsResponse` - API response types
  - `LazyLoadOptions` - Options for lazy loading functions with CSRF fields

- `translations` property in `useTranslations()` return value - Access raw translations object

### Changed

- **Breaking**: LocaleSwitcher default endpoint changed from `/locale` to `/lingua/locale` to match Laravel Lingua's route
- Improved `useTranslations` hook with `useCallback` and `useMemo` for better performance
- Enhanced TypeScript types with better documentation and stricter typing
- Completely rewrote README with simpler, more explicit documentation
- Added Table of Contents and API Reference section to README

### Fixed

- Improved type safety by removing `any` types in translations handling
- SSR compatibility - Browser-only APIs are checked before access

## [1.1.2] - 2026-01-17

### Fixed

- Externalized `lucide-react` and `react/jsx-runtime` in Vite build config
- Fixed "does not provide an export named 'LocaleSwitcher'" error
- Reduced bundle size from 34KB to 10KB

## [1.1.1] - 2026-01-17

### Fixed

- Expanded `lucide-react` peer dependency from `^0.400.0 || ^0.500.0` to `>=0.400.0` to support newer versions (e.g., 0.562.0)

## [1.1.0] - 2026-01-17

### Added

- **LocaleSwitcher Component** - A pre-built, accessible locale switcher with shadcn UI styling
  - `dropdown` variant (default) - Button with dropdown menu for locale selection
  - `buttons` variant - Inline buttons for each available locale
  - `showFlag` prop - Display flag emojis alongside locale names
  - `endpoint` prop - Customizable API endpoint for locale switching (default: `/locale`)
  - `localeNames` prop - Override default display names for locales
  - `className` prop - Additional CSS classes for styling customization
  - Built-in support for 30+ languages with display names and flag emojis
  - Full keyboard navigation (Arrow keys, Enter, Escape, Tab)
  - ARIA labels and roles for screen reader accessibility
  - Click outside to close functionality
  - Dark mode support with Tailwind CSS `dark:` variants
  - Smooth transitions and animations
- `LocaleSwitcherProps` type export for TypeScript users
- `lucide-react` as optional peer dependency for icons (Globe, Check, ChevronDown)

### Changed

- Updated README.md with comprehensive LocaleSwitcher documentation
- Added Features section to README.md highlighting package capabilities

## [1.0.0] - 2025-01-14

### Added

- `useTranslations` hook for accessing Laravel Lingua translations in React components
- `__()` translation function with support for dot notation keys (e.g., `messages.welcome`)
- Parameter replacement support using Laravel's `:placeholder` syntax
- `locale` - current locale accessor (defaults to `'en'`)
- `locales` - available locales array accessor (defaults to `['en']`)
- Full TypeScript support with exported `LinguaProps` and `TranslateFunction` types
- Support for React 18+ and React 19+
- Support for @inertiajs/react 1.0+ and 2.0+
- ESM and CommonJS dual package distribution
- Source maps for debugging
