export const getLocale = async (lang) => {
  const module = await import(`@repo/locales/src/${lang}/api.json`, { assert: { type: 'json' } });
  return module.default || module;
};