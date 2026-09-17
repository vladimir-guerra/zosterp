import { getAssociates, inviteAssociate, removeAssociate } from '../endpoints/associates.js';
import { isAuth } from "../middlewares/auth.js";
import { Router } from "express";

export const associateRouter = Router();

associateRouter.use(isAuth);

associateRouter.get("/", getAssociates);
associateRouter.post("/invitation/:companyId", inviteAssociate);
associateRouter.delete("/:email", removeAssociate);