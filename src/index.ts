// Provider
export { LinguaProvider, useLinguaContext } from './LinguaProvider';

// Hooks
export { useTranslations } from './useTranslations';
export type { UseTranslationsReturn } from './useTranslations';
export { useLazyTranslations } from './useLazyTranslations';

// Components
export { LocaleSwitcher } from './components/LocaleSwitcher';

// Lazy Loading
export {
  fetchTranslationGroup,
  fetchTranslationGroups,
  fetchAvailableGroups,
  createLazyLoader,
  getCSRFToken,
} from './lazyLoading';

// Types
export type {
  LinguaProps,
  LinguaPageProps,
  TranslateFunction,
  LocaleSwitcherProps,
  TranslationGroupResponse,
  TranslationsResponse,
  AvailableGroupsResponse,
  LazyLoadOptions,
  LinguaContextValue,
  LinguaProviderProps,
  UseLazyTranslationsOptions,
  UseLazyTranslationsReturn,
} from './types';
