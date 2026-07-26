import { sendMail } from "@repo/email";
import base from "../base.js";
import sendError from "http-errors";
import jwt from "jsonwebtoken";

/**
 * Endpoint para solicitar renovación de email.
 * @param {string} idKey - Nombre del recurso que renovará email.
 * @returns {Function} - Middleware
 */
export const requestEmail = (idKey) => {
  return base(async (req, res, next) => {
    const id = req[`${idKey}Id`];
    const { email } = req.data;
    const SECRET = process.env.JWT_RENEW_EMAIL;
    const token = jwt.sign({ id, email }, SECRET, { expiresIn: "5m" });
    const URL = `${process.env.FRONTEND_URL}/${idKey}/email?token=${token}`;
    await sendMail(
      email,
      "Cambiar email",
      `<a href="${URL}">Cambiar email</a>`,
    );
    return res.sendStatus(200);
  });
};

/**
 * Endpoint para procesar renovación de email.
 * @param {object} Model - Modelo sequelize para realizar la operación.
 * @returns {Function} - Middleware
 */
export const renewEmail = (Model) => {
  return base(async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw sendError(401, "Token inválido");
    const { id, email } = jwt.verify(token, process.env.JWT_RENEW_EMAIL);
    await Model.update({ email }, { where: { id } });
    return res.sendStatus(200);
  });
};

/**
 * Endpoint para conseguir un registro único de un recurso.
 * @param {object} Model - Modelo sequelize para realizar la operación.
 * @param {object} options - Opciones para la búsqueda.
 * @returns {Function} - Middleware
 */
export const get = (Model, options = {}) => {
  return base(async (req, res, next) => {
    let record;
    if (!options?.where) {
      const key = `${Model.name.toLowerCase()}Id`;
      const id = req.params[key] || req[key];
      if (!id) throw sendError(400, "Identificador no proporcionado");
      record = await Model.findByPk(id, { plain: true, ...options });
    } else record = await Model.findOne({ plain: true, ...options });
    if (!record) throw sendError(404, `${Model.name} no encontrado`);
    return res.status(200).json({ record });
  });
};

/**
 * Endpoint para conseguir varios registros de un recurso.
 * @param {object} Model - Modelo sequelize para realizar la operación.
 * @param {object} options - Opciones para la búsqueda.
 * @returns {Function} - Middleware
 */
export const getAll = (Model, options = {}) => {
  return base(async (req, res, next) => {
    const limit = parseInt(req.query.limit, 10) || 50;
    const page = parseInt(req.query.page, 10) || 1;

    const resolvedOptions =
      typeof options === "function" ? options(req) : options;

    const offset = (page - 1) * limit;

    const { count, rows } = await Model.findAndCountAll({
      ...resolvedOptions,
      limit: limit + 1,
      offset,
      distinct: true,
    });

    const hasNext = rows.length > limit;
    const data = hasNext ? rows.slice(0, limit) : rows;

    return res.status(200).json({
      success: true,
      records: data,
      page,
      hasPrev: page > 1,
      hasNext,
      totalCount: count,
    });
  });
};

/**
 * Endpoint para eliminar un registro de un recurso.
 * @param {object} Model - Modelo sequelize para realizar la operación.
 * @param {object} options - Opciones para la búsqueda.
 * @returns {Function} - Middleware
 */
export const remove = (Model, options = {}) => {
  return base(async (req, res, next) => {
    const key = `${Model.name.toLowerCase()}Id`;
    const resolvedOptions =
      typeof options === "function" ? options(req) : options;

    const where = resolvedOptions.where || { id: req.params[key] || req[key] };

    if (!where.id && Object.keys(where).length === 0)
      throw sendError(400, "Identificador no proporcionado");

    const deleted = await Model.destroy({ ...resolvedOptions, where });
    if (!deleted) throw sendError(404, "Recurso no encontrado");

    return res.sendStatus(200);
  });
};
