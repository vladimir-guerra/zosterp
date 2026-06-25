import { useForm } from "react-hook-form";
import { Form, Input } from "../../components";
import { loginSchema } from "@repo/schemas";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Box, AppBar, Toolbar, Typography, Paper } from "@mui/material";
import { useAuth } from "../../providers";

export default function Login() {
  const { login } = useAuth();
  const { t } = useTranslation("web");
  const date = new Date();
  const Year = `${date.getFullYear()}`;

  const handleSubmit = (data) => {login(data); };

  return (
    // Contenedor principal: Ocupa toda la pantalla y organiza los elementos en columna
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "grey.50",
      }}
    >
      {/* --- HEADER --- */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            ZostERP
          </Typography>
        </Toolbar>
      </AppBar>

      {/* --- CONTENIDO PRINCIPAL (Formulario centrado) --- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Esto empuja el footer hacia abajo
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        {/* Tarjeta blanca con sombra que envuelve tu formulario */}
        <Paper
          elevation={3}
          sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 2 }}
        >
          <Form schema={loginSchema} handler={handleSubmit}>
            {/* Reemplazamos el <h1> puro por Typography para respetar el diseño de MUI */}
            <Typography
              variant="h4"
              align="center"
              fontWeight="bold"
              gutterBottom
              sx={{ mb: 3 }}
            >
              {t("Login")}
            </Typography>

            <Input name={"email"} />
            <Input name={"password"} />

            {/* Contenedor flexible para ordenar y estilizar un poco los links de React Router */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                mt: 1,
              }}
            >
              <Link
                to={"/auth/password"}
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontSize: "1.2rem",
                }}
              >
                {t("recover-password")}
              </Link>
              <Link
                to={"/auth/register"}
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontSize: "1.2rem",
                }}
              >
                {t("user-register")}
              </Link>
            </Box>
          </Form>
        </Paper>
      </Box>

      {/* --- FOOTER --- */}
      <Box
        component="footer"
        sx={{
          bgcolor: "primary.dark",
          color: "white",
          py: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Contact
        </Typography>
        <Typography>zost.erp.support@gmail.com</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          &copy; {Year} Fiscella&Asociados. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
