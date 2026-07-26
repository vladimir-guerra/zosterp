import sendError from "http-errors";
import { Company, Associate, Role, Permission } from "@repo/database";
import { ACTION, RESOURCE } from "@repo/enums";
import { sendMail } from "@repo/email";
import base from "../base.js";
import jwt from "jsonwebtoken";

export const createCompany = base(async (req, res, next) => {
  const [company, created] = await Company.findOrCreate({
    where: { email: req.data.email },
    defaults: req.data,
    plain: true,
  });

  if (created) {
    const role = await Role.create({ name: "OWNER", companyId: company.id });
    let permissions = [];
    for (const action of Object.keys(ACTION)) {
      for (const resource of Object.keys(RESOURCE))
        permissions.push({ action, resource, roleId: role.id });
    }
    await Permission.bulkCreate(permissions);
    await Associate.create({ userId: req.userId, roleId: role.id });
  }

  if (company.isValid) return res.status(201).json({ company });

  const SECRET = process.env.JWT_ACTIVATE_COMPANY;
  const tok = jwt.sign({ companyId: company.id }, SECRET, { expiresIn: "5m" });
  const URL = `${process.env.FRONTEND_URL}/companies/${company.id}/activate?token=${tok}`;
  await sendMail(
    company.email,
    "Activar empresa",
    `<a href="${URL}">Activar empresa</a>`,
  );
  return res.sendStatus(200);
});

export const activateCompany = base(async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) throw sendError(404, "Token inválido.");
  const { companyId } = jwt.verify(token, process.env.JWT_ACTIVATE_COMPANY);
  await Company.update({ isValid: true }, { where: { id: companyId } });
  return res.sendStatus(200);
});
