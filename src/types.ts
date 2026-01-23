/**
 * The lingua data structure shared via Inertia props
 */
export interface LinguaProps {
  locale: string;
  locales: string[];
  translations: Record<string, Record<string, string | object>>;
  direction: 'ltr' | 'rtl';
  isRtl: boolean;
}

/**
 * The wrapper structure for Inertia page props
 */
export interface LinguaPageProps {
  lingua: LinguaProps;
  [key: string]: unknown;
}

/**
 * Translation function type - uses Laravel's __ convention
 */
export type TranslateFunction = (key: string, replacements?: Record<string, string | number>) => string;

