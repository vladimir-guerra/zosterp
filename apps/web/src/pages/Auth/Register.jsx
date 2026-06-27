import { useForm } from "react-hook-form";
import { Form, Input } from "../../components";
import { insertUserSchema } from "@repo/schemas";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../providers";
import { Box, AppBar, Toolbar, Typography, Paper, Button } from "@mui/material";


export default function Register() {

  const { login } = useAuth();
  const { t } = useTranslation("web");
  const handleSubmit = (data) => {
    login(data);
  };
  const date = new Date();
  const Year = `${date.getFullYear()}`;

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>

        {/* --- HEADER --- */}
        <AppBar
          position="static"
          elevation={0}
          sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'grey.200' }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 'bold' }}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
        >
          {/* Tarjeta blanca con sombra que envuelve el formulario */}
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 2, justifyContent: 'center' }}>

            <Form schema={insertUserSchema} handler={handleSubmit}>
              <Typography variant="h4">{t("Register")}</Typography>
              <Input name={"name"} />
              <Input name={"surname"} />
              <Input name={"email"} />
              <Input name={"password"} />
              <Input name={"confirmPassword"} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
              </Box>
            </Form>
            <Link to={"/auth/login"} style={{
              textDecoration: "none",
              color: "#1976d2",
              fontSize: "1.2rem",
              display: "flex",
              marginTop: "1rem"
            }}>{t("Login")}</Link>
          </Paper>
        </Box>

        {/* --- FOOTER --- */}
        <Box
          component="footer"
          sx={{
            bgcolor: 'primary.dark',
            color: 'white',
            py: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>Contact</Typography>
          <Typography>zost.erp.support@gmail.com</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            &copy; {Year} Fiscella&Asociados. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </>
  );
}
