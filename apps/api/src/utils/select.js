/**
 * Paginador de queries sequelize
 * * @param Mode - el modelo que realizará la query
 * * @param where - las condiciones de la query
 * * @param limit - la máxima cantidad de rows a traer de la query
 * * @param page - la página, duh
 * @returns Una promesa con la res
 */
export default async function paginateQuery(
  Model,
  where = {},
  limit = 50,
  page = 1,
) {
  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await Model.findAndCountAll({
      where,
      limit: limit + 1,
      offset,
      distinct: true,
    });

    const hasNext = rows.length > limit;
    const data = hasNext ? rows.slice(0, limit) : rows;

    return {
      succes: true,
      records: data,
      page,
      hasPrev: page > 1,
      hasNext,
      totalCount: count,
    };
  } catch (error) {
    throw error;
  }
}
