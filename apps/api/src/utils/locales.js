/**
 * Devuelve el archivo JSON para generar la respuesta de la API (@repo/locales)
 */
export default async function getLocales(lang) {
  const module = await import(`@repo/locales/src/${lang}/api.json`, {
    assert: { type: "json" },
  });
  return module.default || module;
}
