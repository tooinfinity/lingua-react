# @tooinfinity/lingua-react

React bindings for [Laravel Lingua](https://github.com/tooinfinity/lingua) - seamless translations with Inertia.js.

[![npm version](https://img.shields.io/npm/v/@tooinfinity/lingua-react)](https://www.npmjs.com/package/@tooinfinity/lingua-react)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@tooinfinity/lingua-react)](LICENSE.md)

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [Automatic Lazy Loading](#automatic-lazy-loading)
- [LocaleSwitcher Component](#localeswitcher-component)
- [API Reference](#api-reference)
- [TypeScript](#typescript)

---

## Installation

```bash
npm install @tooinfinity/lingua-react
```

**Requirements:**
- React 18+ or 19+
- @inertiajs/react 1.0+ or 2.0+
- Laravel Lingua (PHP package) installed on backend

**Optional dependencies:**
```bash
npm install lucide-react    # For LocaleSwitcher icons
npm install tailwindcss     # For LocaleSwitcher styling
```

---

## Quick Start

### Step 1: Wrap your app with LinguaProvider

```tsx
// resources/js/app.tsx
import { LinguaProvider } from '@tooinfinity/lingua-react';

createInertiaApp({
  // ...
  setup({ el, App, props }) {
    createRoot(el).render(
      <LinguaProvider>
        <App {...props} />
      </LinguaProvider>
    );
  },
});
```

### Step 2: Use translations in any component

```tsx
import { useTranslations } from '@tooinfinity/lingua-react';

function Welcome() {
  const { __ } = useTranslations();

  return <h1>{__('messages.welcome')}</h1>;
}
```

**That's it!** Your Laravel translations are now available in React.

---

## Basic Usage

### The `__()` Translation Function

```tsx
import { useTranslations } from '@tooinfinity/lingua-react';

function MyComponent() {
  const { __ } = useTranslations();

  return (
    <div>
      {/* Simple key */}
      <h1>{__('messages.welcome')}</h1>
      
      {/* With placeholder replacement (Laravel :placeholder syntax) */}
      <p>{__('messages.greeting', { name: 'John' })}</p>
      
      {/* Returns the key if translation not found */}
      <span>{__('unknown.key')}</span> {/* Output: "unknown.key" */}
    </div>
  );
}
```

### Access Locale Information

```tsx
import { useTranslations } from '@tooinfinity/lingua-react';

function LanguageInfo() {
  const { locale, locales, direction, isRtl } = useTranslations();

  return (
    <div dir={direction}>
      <p>Current: {locale}</p>           {/* "en" */}
      <p>Available: {locales.join(', ')}</p> {/* "en, fr, ar" */}
      <p>Direction: {direction}</p>      {/* "ltr" or "rtl" */}
      <p>Is RTL: {isRtl ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

---

## Automatic Lazy Loading

Load translation groups on-demand when components mount.

### Why Use Lazy Loading?

- **Smaller initial bundle** - Only load translations needed for the current page
- **Faster page loads** - Fetch additional groups in the background
- **Per-component translations** - Each component loads only what it needs

### Basic Example

```tsx
import { useLazyTranslations } from '@tooinfinity/lingua-react';

function Dashboard() {
  const { __, isLoading } = useLazyTranslations({ 
    groups: ['dashboard'] 
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <h1>{__('dashboard.welcome')}</h1>;
}
```

**What happens:**
1. Component mounts
2. `dashboard` translations are fetched automatically via `GET /lingua/translations/dashboard`
3. `isLoading` becomes `false` when ready
4. Translations are cached - subsequent renders don't re-fetch

### Load Multiple Groups

```tsx
const { __, isLoading, isLoaded } = useLazyTranslations({ 
  groups: ['dashboard', 'widgets', 'notifications'] 
});

// isLoading = true while ANY group is loading
// isLoaded = true when ALL groups are loaded
```

### Handle Errors

```tsx
function Dashboard() {
  const { __, isLoading, error, reload } = useLazyTranslations({
    groups: ['dashboard'],
    onError: (err) => console.error('Failed:', err),
  });

  if (error) {
    return (
      <div>
        <p>Failed to load translations</p>
        <button onClick={reload}>Try Again</button>
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;

  return <h1>{__('dashboard.welcome')}</h1>;
}
```

### Manual Loading (Lazy Mode)

Disable automatic loading and fetch manually:

```tsx
function SettingsModal({ isOpen }) {
  const { __, loadGroup, isLoading } = useLazyTranslations({ 
    groups: [],      // No groups to auto-load
    eager: false     // Disable automatic loading
  });

  useEffect(() => {
    if (isOpen) {
      loadGroup('settings');
    }
  }, [isOpen]);

  // ...
}
```

### Caching & Deduplication

The `LinguaProvider` automatically:
- **Caches** loaded groups - won't re-fetch already loaded translations
- **Deduplicates** requests - multiple components requesting the same group trigger only one fetch
- **Reloads on locale change** - clears cache and re-fetches when user switches language

```tsx
// Both components request 'common' - only ONE fetch is made
function Header() {
  const { __ } = useLazyTranslations({ groups: ['common'] });
  return <h1>{__('common.app_name')}</h1>;
}

function Footer() {
  const { __ } = useLazyTranslations({ groups: ['common'] });
  return <p>{__('common.copyright')}</p>;
}
```

---

## LocaleSwitcher Component

A ready-to-use locale switcher with dropdown and button variants.

### Basic Usage

```tsx
import { LocaleSwitcher } from '@tooinfinity/lingua-react';

function Header() {
  return (
    <nav>
      <LocaleSwitcher />
    </nav>
  );
}
```

### Variants

```tsx
// Dropdown (default)
<LocaleSwitcher variant="dropdown" />

// Inline buttons
<LocaleSwitcher variant="buttons" />
```

### Show Flags

```tsx
<LocaleSwitcher showFlag />
```

### Custom Locale Names

```tsx
<LocaleSwitcher 
  localeNames={{ 
    en: 'English', 
    fr: 'Français',
    ar: 'العربية' 
  }} 
/>
```

### Custom Endpoint

By default, posts to `/lingua/locale`. Customize:

```tsx
<LocaleSwitcher endpoint="/api/locale" />
```

### Full Example

```tsx
<LocaleSwitcher 
  variant="dropdown"
  showFlag
  localeNames={{
    en: 'English',
    fr: 'Français',
    de: 'Deutsch',
  }}
  className="ml-auto"
/>
```

---

## API Reference

### Hooks

#### `useTranslations()`

Basic hook for accessing translations from Inertia shared props.

```tsx
const { __, locale, locales, direction, isRtl, translations } = useTranslations();
```

| Return | Type | Description |
|--------|------|-------------|
| `__` | `(key, replacements?) => string` | Translation function |
| `locale` | `string` | Current locale |
| `locales` | `string[]` | Available locales |
| `direction` | `'ltr' \| 'rtl'` | Text direction |
| `isRtl` | `boolean` | RTL flag |
| `translations` | `object` | Raw translations |

#### `useLazyTranslations(options)`

Hook with automatic lazy loading.

```tsx
const { 
  __,                // Translation function
  isLoading,         // True while loading
  isLoaded,          // True when all groups loaded
  error,             // Error object if failed
  reload,            // Retry function
  loadGroup,         // Load single group manually
  loadGroups,        // Load multiple groups manually
  ...locale info     // Same as useTranslations
} = useLazyTranslations({ 
  groups: ['dashboard'],  // Groups to load
  eager: true,            // Auto-load on mount (default: true)
  onError: (err) => {},   // Error callback
});
```

#### `useLinguaContext()`

Direct access to LinguaProvider context.

```tsx
const { 
  loadGroup,      // Load a translation group
  loadGroups,     // Load multiple groups
  isGroupLoaded,  // Check if group is loaded
  isGroupLoading, // Check if group is loading
  loadedGroups,   // Set of loaded group names
  loadingGroups,  // Set of loading group names
  ...locale info  // Same as useTranslations
} = useLinguaContext();
```

### Components

#### `<LinguaProvider>`

Wrap your app to enable lazy loading features.

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Child components |
| `lazyLoadOptions` | `object` | `{ baseUrl?, csrfToken?, headers? }` |
| `initialLoadedGroups` | `string[]` | Groups already loaded (auto-detected) |

#### `<LocaleSwitcher>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'dropdown' \| 'buttons'` | `'dropdown'` | Display style |
| `showFlag` | `boolean` | `false` | Show flag emojis |
| `endpoint` | `string` | `'/lingua/locale'` | POST endpoint |
| `localeNames` | `Record<string, string>` | - | Custom names |
| `className` | `string` | - | CSS classes |

### Lazy Loading Functions

For manual control over translation fetching:

```tsx
import { 
  fetchTranslationGroup,   // GET /lingua/translations/{group}
  fetchTranslationGroups,  // POST /lingua/translations
  fetchAvailableGroups,    // GET /lingua/groups
  createLazyLoader,        // Factory with custom options
  getCSRFToken,            // Get CSRF token
} from '@tooinfinity/lingua-react';

// Examples
const { translations } = await fetchTranslationGroup('dashboard');
const { translations } = await fetchTranslationGroups(['auth', 'messages']);
const { groups } = await fetchAvailableGroups();

// With custom options
const loader = createLazyLoader({ baseUrl: '/api' });
await loader.fetchGroup('dashboard');
```

---

## TypeScript

All types are exported:

```tsx
import type { 
  // Props & Data
  LinguaProps,
  LinguaPageProps,
  TranslateFunction, 
  
  // Hook Returns
  UseTranslationsReturn,
  UseLazyTranslationsReturn,
  UseLazyTranslationsOptions,
  
  // Context
  LinguaContextValue,
  LinguaProviderProps,
  
  // Components
  LocaleSwitcherProps,
  
  // Lazy Loading
  LazyLoadOptions,
  TranslationGroupResponse,
  TranslationsResponse,
  AvailableGroupsResponse,
} from '@tooinfinity/lingua-react';
```

---

## CSRF Configuration

CSRF tokens are automatically extracted from:
1. `csrfToken` option (if provided)
2. `<meta name="csrf-token">` tag
3. `XSRF-TOKEN` cookie

**Laravel setup** - Add to your layout:
```html
<meta name="csrf-token" content="{{ csrf_token() }}">
```

---

## License

MIT License. See [LICENSE.md](LICENSE.md).
