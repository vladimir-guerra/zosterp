import { sendMail } from "@repo/email";
import base from "../base";
import { Associate, Company, Role, User } from "@repo/database";
import sendError from "http-errors";
import jwt from "jsonwebtoken";

export const requestAssociate = base(async (req, res, next) => {
  const { role: name, email } = req.data;
  const { companyId, taskId } = req;
  const role = await Role.findOne({ where: { name, companyId } });
  if (!role) throw sendError(404, "Rol no encontrado.");

  const user = await User.findOne({ where: { email } });
  if (user) {
    const associate = await Associate.findOne({
      where: { userId: user.id, taskId },
      include: {
        model: Role,
        required: true,
        where: { companyId },
      },
    });
    if (associate) {
      await Associate.create({ userId: user.id, roleId: role.id, taskId });
      return res.sendStatus(200);
    }
  }

  const PAYLOAD = { roleId: role.id, email, taskId };
  const token = jwt.sign(PAYLOAD, process.env.JWT_ASSOCIATE, {
    expiresIn: "1d",
  });
  const URL = `${process.env.FRONTEND_URL}/auth/associate?token=${token}`;
  await sendMail(email, `Invitación`, `<a href="${URL}">Unirse</a>`);
  return res.sendStatus(200);
});
