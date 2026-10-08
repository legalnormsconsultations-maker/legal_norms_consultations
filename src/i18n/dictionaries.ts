import "server-only";

/**
 * i18n Dictionary Loader
 *
 * Enforces the architectural rule to separate user-visible strings from business logic.
 * Defaulting to 'en' (English). When Hindi ('hi') is added, simply drop a `hi.json`
 * into the locales folder and map it here.
 */

const dictionaries = {
  en: () => import("./locales/en.json").then((module) => module.default),
  hi: () => import("./locales/en.json").then((module) => module.default), // Fallback to EN until hi.json is ready
};

export type Locale = keyof typeof dictionaries;

/**
 * Server-side dictionary fetcher.
 * Use this in Next.js Server Components to inject localized strings.
 */
export const getDictionary = async (locale: Locale = "en") => {
  return dictionaries[locale]();
};
