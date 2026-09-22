import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Container, Paper, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAssociates } from "../../providers/AssociatesProvider.jsx";

import Form from "../../components/Forms/Form.jsx";
import Input from "../../components/Forms/Input.jsx";

import { insertUserSchema } from "../../../../../packages/schemas/src/index.js";

export default function WorkerInvitation() {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const { createAssociate } = useAssociates();
    const { t } = useTranslation("web");

    const [success, setSuccess] = useState(false);

    const handleAcceptInvitation = async (data) => {
        await createAssociate(companyId, data);

        setSuccess(true);
        setTimeout(() => {
            navigate("/auth/login");
        }, 3000);
    };

    if (success) {
        return (
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 5, mt: 10, textAlign: "center", borderRadius: 2 }}>
                    <Typography variant="h4" color="primary" gutterBottom>
                        ¡Invitación Aceptada!
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
                        Tu cuenta ha sido configurada. Te estamos redirigiendo al inicio de sesión...
                    </Typography>
                    <CircularProgress size={30} />
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mt: 8, borderRadius: 2 }}>

                <Box sx={{ mb: 4, textAlign: "center" }}>
                    <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
                        Completar Registro
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Has sido invitado a unirse a una empresa en ZostERP.
                    </Typography>
                </Box>

                <Form handler={handleAcceptInvitation} schema={insertUserSchema}>
                    <Input name="name" />
                    <Input name="surname" />
                    <Input name="email" />
                    <Input name="password" />
                    <Input name={"confirmPassword"} type="password" />
                </Form>

            </Paper>
        </Container>
    );
};