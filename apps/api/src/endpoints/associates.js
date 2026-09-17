import { User, Associate } from "@repo/database";
import createError from "http-errors";
import { sendMail } from "@repo/email";

export const getAssociates = async (req, res, next) => {
    try {
        const { id } = req.user;
        
        const owner = await Associate.findOne({ where: { userId: id } });
        if (!owner) { throw createError(403, "No tienes una compañía asignada"); }

        const associatesResult = await Associate.findAll({
            where: { companyId: owner.companyId },
            include: [{ model: User, attributes: ['name', 'email'] }],
            attributes: {
                exclude: ['deletedAt', 'createdAt', 'updatedAt', 'id']
            }
        });

        const onlyAssociates = associatesResult.filter((associate) => associate.userId != id)

        res.status(200).json({
            response: "Usuarios encontrados",
            associates: onlyAssociates
        });
    } catch (error) {
        next(error);
    }
}

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
        console.log(emailResult);
        
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
        const { email } = req.params.email;
        const { userId } = req.user;

        const userFound = await User.findOne({ where: { email } });
        if (!userFound) throw createError(404, "El usuario no existe en el sistema");

        const owner = await Associate.findOne({ where: { userId } });

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