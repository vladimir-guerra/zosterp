/**
 * Wrapper para centralizar operaciones básicas (manejo de errores).
 * @param {Function} fn - La función que se va a envolver.
 * @returns {Promise<any>} El resultado de la función o un error controlado.
 */
export default function base(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
