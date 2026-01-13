export interface LinguaProps {
  locale: string;
  locales: string[];
  translations: Record<string, any>;
}

export type TranslateFunction = (key: string, replacements?: Record<string, string | number>) => string;
