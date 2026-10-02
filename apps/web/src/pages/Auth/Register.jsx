import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  Snackbar
} from "@mui/material";
import { insertUserSchema } from "@repo/schemas";
import { Form, Input } from "../../components";
import { useAuth } from "../../providers";

const CURRENT_YEAR = new Date().getFullYear();

export default function Register() {
  const { register } = useAuth();

  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);

      await register(data);

      setSuccessMsg("Cuenta creada exitosamente. Por favor, revisa tu correo para activarla.");
      setOpenSnackbar(true);
    } catch (error) {
      setErrorMsg(error.message || "Ocurrió un error al registrar la cuenta.");
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "grey.50" }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: "white", borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "primary.main", fontWeight: "bold" }}
          >
            ZostERP
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
            Registro
          </Typography>

          {errorMsg && (
            <Alert severity="error" onClose={() => setErrorMsg(null)} sx={{ mb: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {errorMsg}
            </Alert>
          )}

          {successMsg && (
            <Alert severity="success" onClose={() => setSuccessMsg(null)} sx={{ mb: 2 }}>
              <AlertTitle>¡Envío exitoso!</AlertTitle>
              {successMsg}
            </Alert>
          )}

          <Form schema={insertUserSchema} handler={handleSubmit}>
            <Input name="name" label="Nombre" />
            <Input name="surname" label="Apellido" />
            <Input name="email" label="Correo electrónico" />
            <Input name="password" type="password" label="Contraseña" />
            <Input name="confirmPassword" type="password" label="Confirmar contraseña" />
          </Form>

          <Typography
            component={Link}
            to="/auth/login"
            sx={{
              textDecoration: "none",
              color: "primary.main",
              fontSize: "1rem",
              fontWeight: "medium",
              display: " inline-block",
              mt: 2
            }}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Typography>
        </Paper>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: "100%" }}>
          {successMsg}
        </Alert>
      </Snackbar>

      <Box component="footer" sx={{ bgcolor: "primary.dark", color: "white", py: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>Contact</Typography>
        <Typography>zost.erp.support@gmail.com</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          &copy; {CURRENT_YEAR} Fiscella&Asociados. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}