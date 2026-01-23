# @tooinfinity/lingua-react

React bindings for [Laravel Lingua](https://github.com/tooinfinity/lingua) - seamless translations with Inertia.js.

[![npm version](https://img.shields.io/npm/v/@tooinfinity/lingua-react)](https://www.npmjs.com/package/@tooinfinity/lingua-react)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@tooinfinity/lingua-react)](LICENSE.md)

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
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

---

## Quick Start

### Use translations in any component

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

### Switch Locales (Example)

```tsx
import { router } from '@inertiajs/react';
import { useTranslations } from '@tooinfinity/lingua-react';

function LocaleSwitcher() {
  const { locale, locales } = useTranslations();

  const switchLocale = (newLocale: string) => {
    router.post('/lingua/locale', { locale: newLocale });
  };

  return (
    <div>
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          disabled={loc === locale}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
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

---

## TypeScript

All types are exported:

```tsx
import type { 
  LinguaProps,
  LinguaPageProps,
  TranslateFunction, 
  UseTranslationsReturn,
} from '@tooinfinity/lingua-react';
```

---

## License

MIT License. See [LICENSE.md](LICENSE.md).
