/**
 * Obtiene el JSON de traducciones para la API según el idioma proporcionado.
 * * @param lang - Idioma ISO disponible en locales
 * @returns Una promesa que resuelve al objeto de traducciones.
 */
export default async function getLocale(lang, module = "api") {
  const foundModule = await import(`@repo/locales/src/${lang}/${module}.json`, {
    with: { type: "json" },
  });
  return foundModule.default;
}
