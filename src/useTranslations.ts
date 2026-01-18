import { usePage } from '@inertiajs/react';

interface LinguaData {
  locale: string;
  locales: string[];
  translations: Record<string, any>;
  direction: 'ltr' | 'rtl';
  isRtl: boolean;
}

export function useTranslations() {
  const { props } = usePage<{ lingua?: LinguaData;[key: string]: unknown }>();
  const lingua = props.lingua;

  const __ = (key: string, replacements?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = lingua?.translations;

    for (const k of keys) {
      if (value === undefined || value === null) break;
      value = value[k];
    }

    if (typeof value !== 'string') return key;

    if (replacements) {
      return Object.entries(replacements).reduce(
        (str, [k, v]) => str.replace(new RegExp(`:${k}`, 'g'), String(v)),
        value
      );
    }

    return value;
  };

  return {
    __,
    locale: lingua?.locale ?? 'en',
    locales: lingua?.locales ?? ['en'],
    direction: lingua?.direction ?? 'ltr',
    isRtl: lingua?.isRtl ?? false,
  };
}
