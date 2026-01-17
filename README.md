# @tooinfinity/lingua-react

[![npm version](https://img.shields.io/npm/v/@tooinfinity/lingua-react)](https://www.npmjs.com/package/@tooinfinity/lingua-react)
[![npm downloads](https://img.shields.io/npm/dm/@tooinfinity/lingua-react)](https://www.npmjs.com/package/@tooinfinity/lingua-react)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@tooinfinity/lingua-react)](https://bundlephobia.com/package/@tooinfinity/lingua-react)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61DAFB.svg)](https://react.dev/)
[![License](https://img.shields.io/npm/l/@tooinfinity/lingua-react)](LICENSE.md)

> ⚠️ **Under Development** - This package is currently under active development and is not ready for production use. APIs may change without notice.

React bindings for [Laravel Lingua](https://github.com/tooinfinity/lingua) - seamless translations with Inertia.js.

## Features

- 🌍 **useTranslations Hook** - Access translations with Laravel-style syntax
- 🔄 **LocaleSwitcher Component** - Beautiful, accessible locale switcher with shadcn UI styling
- 🎨 **Dark Mode Support** - Built-in dark mode with Tailwind CSS
- ⌨️ **Keyboard Navigation** - Full accessibility with ARIA support
- 🚀 **TypeScript Ready** - Complete type definitions included
- 📦 **Tree Shakeable** - Import only what you need

## Installation

```bash
npm install @tooinfinity/lingua-react
```

### Optional: Install lucide-react for icons

The `LocaleSwitcher` component uses [Lucide React](https://lucide.dev/) icons. Install it if you want to use the component:

```bash
npm install lucide-react
```

## Requirements

- React 18+ or 19+
- @inertiajs/react 1.0+ or 2.0+
- Laravel Lingua (PHP package)
- Tailwind CSS (for LocaleSwitcher styling)
- lucide-react (optional, for LocaleSwitcher icons)

## Usage

### Basic Translation

```tsx
import { useTranslations } from '@tooinfinity/lingua-react';

function Welcome() {
  const { __, locale, locales } = useTranslations();

  return (
    <div>
      <p>Current locale: {locale}</p>
      <h1>{__('messages.welcome')}</h1>
      <p>{__('messages.greeting', { name: 'John' })}</p>
    </div>
  );
}
```

### useTranslations Hook Returns

| Property | Type | Description |
|----------|------|-------------|
| `__` | `(key: string, replacements?: Record<string, string \| number>) => string` | Translation function (Laravel convention) |
| `locale` | `string` | Current locale (default: `'en'`) |
| `locales` | `string[]` | Available locales (default: `['en']`) |

### Translation Keys

Use dot notation for nested translations:

```tsx
// For translation file: { "messages": { "hello": "Hello :name" } }
__('messages.hello', { name: 'World' }) // "Hello World"
```

---

## LocaleSwitcher Component

A pre-built, accessible locale switcher component with shadcn UI styling. Supports dropdown and button variants with full keyboard navigation and dark mode.

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

### With Flags

```tsx
<LocaleSwitcher showFlag />
```

### Button Variant

Display locales as inline buttons instead of a dropdown:

```tsx
<LocaleSwitcher variant="buttons" showFlag />
```

### Custom Endpoint

By default, the component posts to `/locale`. Customize this:

```tsx
<LocaleSwitcher endpoint="/api/switch-locale" />
```

### Custom Locale Names

Override the default display names:

```tsx
<LocaleSwitcher 
  localeNames={{ 
    en: 'English (US)', 
    fr: 'Français',
    es: 'Español' 
  }} 
/>
```

### Full Example

```tsx
import { LocaleSwitcher } from '@tooinfinity/lingua-react';

function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <LocaleSwitcher 
        variant="dropdown"
        showFlag
        endpoint="/locale"
        localeNames={{
          en: 'English',
          fr: 'Français',
          de: 'Deutsch',
        }}
        className="ml-auto"
      />
    </header>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'dropdown' \| 'buttons'` | `'dropdown'` | Display style - dropdown menu or inline buttons |
| `showFlag` | `boolean` | `false` | Show flag emojis alongside locale names |
| `endpoint` | `string` | `'/locale'` | API endpoint for locale switching |
| `localeNames` | `Record<string, string>` | - | Custom display names for locales |
| `className` | `string` | - | Additional CSS classes for the root element |

### Supported Locales

The component includes built-in display names and flags for 30+ languages:

| Code | Language | Flag |
|------|----------|------|
| `en` | English | 🇺🇸 |
| `es` | Español | 🇪🇸 |
| `fr` | Français | 🇫🇷 |
| `de` | Deutsch | 🇩🇪 |
| `it` | Italiano | 🇮🇹 |
| `pt` | Português | 🇵🇹 |
| `ja` | 日本語 | 🇯🇵 |
| `zh` | 中文 | 🇨🇳 |
| `ko` | 한국어 | 🇰🇷 |
| `ar` | العربية | 🇸🇦 |
| ... | and 20+ more | ... |

Unknown locale codes will display as uppercase (e.g., `XY` → `XY`) with a 🌐 globe flag.

### Accessibility

The LocaleSwitcher component is built with accessibility in mind:

- ✅ Full keyboard navigation (Arrow keys, Enter, Escape, Tab)
- ✅ ARIA labels and roles (`listbox`, `option`, `aria-selected`)
- ✅ Focus management and visible focus states
- ✅ Screen reader friendly
- ✅ Click outside to close

### Styling

The component uses Tailwind CSS classes compatible with shadcn UI's design system:

- Slate color palette for neutral tones
- Proper hover, focus, and active states
- Dark mode support via `dark:` variants
- Smooth transitions and animations

To customize the styling, you can:

1. Pass additional classes via the `className` prop
2. Override styles using Tailwind's utility classes
3. Use CSS custom properties if your project supports them

### Laravel Backend Setup

Make sure your Laravel backend has a route to handle locale switching:

```php
// routes/web.php
Route::post('/locale', function (Request $request) {
    $locale = $request->validate(['locale' => 'required|string|in:en,fr,de,es'])['locale'];
    
    session(['locale' => $locale]);
    app()->setLocale($locale);
    
    return back();
});
```

---

## Custom Locale Switcher

If you need more control, you can build your own switcher using the hook:

```tsx
import { useTranslations } from '@tooinfinity/lingua-react';
import { router } from '@inertiajs/react';

function CustomLocaleSwitcher() {
  const { locale, locales } = useTranslations();

  const switchLocale = (newLocale: string) => {
    router.post('/locale', { locale: newLocale });
  };

  return (
    <select value={locale} onChange={(e) => switchLocale(e.target.value)}>
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
```

---

## TypeScript

Full TypeScript support with exported types:

```tsx
import type { 
  LinguaProps, 
  TranslateFunction, 
  LocaleSwitcherProps 
} from '@tooinfinity/lingua-react';
```

### Type Definitions

```typescript
interface LinguaProps {
  locale: string;
  locales: string[];
  translations: Record<string, any>;
}

type TranslateFunction = (
  key: string, 
  replacements?: Record<string, string | number>
) => string;

interface LocaleSwitcherProps {
  endpoint?: string;
  className?: string;
  showFlag?: boolean;
  localeNames?: Record<string, string>;
  variant?: 'dropdown' | 'buttons';
}
```

---

## Development

```bash
# Install dependencies
npm install

# Type check
npm run typecheck

# Build
npm run build

# Watch mode
npm run dev
```

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
