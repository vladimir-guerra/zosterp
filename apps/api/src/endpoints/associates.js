import { User, Associate, Role } from "@repo/database";
import { Op } from '@repo/database/src/connection.js';
import createError from "http-errors";
import { sendMail } from "@repo/email";

export const getAssociates = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let { companyId } = req.query;

        if (!companyId) {
            const myAssociateRecord = await Associate.findOne({
                where: { userId }
            });

            if (!myAssociateRecord) {
                return res.status(200).json({ data: [], currentUserId: userId });
            }

            companyId = myAssociateRecord.companyId;
        }

        const associates = await Associate.findAll({
            where: { companyId },
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "surname", "email", "roleId"],
                    include: [
                        {
                            model: Role,
                            attributes: ["id", "name"]
                        }
                    ]
                }
            ]
        });

        return res.status(200).json({
            data: associates,
            currentUserId: userId
        });
    } catch (error) {
        next(error);
    }
};

export const createAssociate = async (req, res, next) => {
    try {
        const { companyId } = req.params;
        const { email, ...userData } = req.data || req.body;

        const roleUser = await Role.findOne({ where: { name: 'associate' } });
        if (!roleUser) throw createError(500, "El rol 'associate' no existe en el sistema");

        const [newUser, userCreated] = await User.findOrCreate({
            where: { email: email },
            defaults: { ...userData, roleId: roleUser.id }
        });

        if (!newUser) throw createError(400, "Error al crear o buscar el usuario");

        const [newAssociate, associateCreated] = await Associate.findOrCreate({
            where: { userId: newUser.id, companyId: companyId },
        });

        if (!newAssociate) throw createError(400, "Error al vincular el asociado a la empresa");

        res.status(201).json({ response: 'Usuario procesado exitosamente', associate: associateCreated, wasUserCreated: userCreated });
    } catch (error) {
        next(error);
    }
};

export const inviteAssociate = async (req, res, next) => {
    try {
        const { email } = req.body;
        const { id } = req.user;
        const { companyId } = req.params;

        const ownerSender = await Associate.findOne({ where: { userId: id, companyId: companyId } });

        if (!ownerSender) throw createError(403, "No tienes permisos para invitar");


        const receiverUser = await User.findOne({ where: { email } });

        if (receiverUser) {
            const isAssociate = await Associate.findOne({
                where: { userId: receiverUser.id, companyId }
            });

            if (isAssociate) { throw createError(400, "El usuario ya es un asociado de tu empresa"); }
        }

        const emailResult = await sendMail({
            to: email,
            subject: "Invitación a la compañía",
            html: `
            <h3>Para ingresar a la empresa debe aceptar la invitación: </h3>
            <a href="http://localhost:5173/workerInvitation/${companyId}">Aceptar Invitación</a>
            `
        });

        res.status(200).json({
            message: "Invitación enviada",
            link: emailResult?.url || null
        });
    } catch (error) {
        next(error);
    }
}

export const removeAssociate = async (req, res, next) => {
    try {
        const { email } = req.params;
        const { id } = req.user;

        const userFound = await User.findOne({ where: { email } });
        if (!userFound) throw createError(404, "El usuario no existe en el sistema");

        const owner = await Associate.findOne({ where: { userId: id } });

        const deletedRows = await Associate.destroy({
            where: {
                userId: userFound.id,
                companyId: owner.companyId
            }
        });

        if (deletedRows === 0) { throw createError(404, "Este usuario no es asociado de tu empresa"); }
        res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        next(error);
    }
}

export const updateAssociate = async (req, res, next) => {
    try {
        const { companyId } = req.params;
        const { userId, roleName } = req.body;

        const associate = await Associate.findOne({
            where: { userId: userId, companyId: companyId }
        });

        if (!associate) {
            throw createError(404, "Asociado no encontrado en esta compañía");
        }

        let targetRoleId;
        if (!targetRoleId && roleName) {
            if (roleName === "owner") {
                throw createError(403, "Solo puede haber un propietario por compañía");
            }
            const roleRecord = await Role.findOne({ where: { name: roleName } });
            if (!roleRecord) {
                throw createError(404, "El rol especificado no existe");
            }
            targetRoleId = roleRecord.id;
        }

        await User.update({ roleId: targetRoleId }, { where: { id: userId } });

        res.status(200).json({
            response: "Se ha actualizado el rol del asociado",
            data: { id: User.id, roleId: targetRoleId, roleName }
        });
    } catch (error) {
        next(error);
    }
};
