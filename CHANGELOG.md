# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
