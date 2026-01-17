# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
