# @tooinfinity/lingua-react

React bindings for [Laravel Lingua](https://github.com/tooinfinity/lingua) - seamless translations with Inertia.js.

## Installation

```bash
npm install @tooinfinity/lingua-react
```

## Requirements

- React 18+ or 19+
- @inertiajs/react 1.0+ or 2.0+
- Laravel Lingua (PHP package)

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

### Available Returns

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

### Locale Switcher Example

```tsx
import { useTranslations } from '@tooinfinity/lingua-react';
import { router } from '@inertiajs/react';

function LocaleSwitcher() {
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

## TypeScript

Full TypeScript support with exported types:

```tsx
import type { LinguaProps, TranslateFunction } from '@tooinfinity/lingua-react';
```

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
