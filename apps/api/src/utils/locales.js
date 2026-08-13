/**
 * Devuelve el archivo JSON para generar la respuesta de la API (@repo/locales)
 */
export default async function getLocales(lang) {
  try {
    const module = await import(`@repo/locales/src/${lang}/api.json`, {
      with: { type: "json" },
    });
    return module.default || module;
  } catch (error) {
    console.error("Error al cargar locales:", error.message);
    return {};
  }
}
