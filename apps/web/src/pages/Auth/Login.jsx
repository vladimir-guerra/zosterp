import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Input } from "../../components";
import { loginSchema } from "@repo/schemas";
import { Link, useNavigate } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Paper, Alert, Button } from "@mui/material";
import { useAuth } from "../../providers";

export default function Login() {
  const { auth, error } = useAuth();
  const date = new Date();
  const Year = `${date.getFullYear()}`;
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    const result = await auth(data, false);
    if(result.to2FA)
      navigate(`/auth/2FA/${result.token}`)
    else
      navigate("/erp")
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "grey.50",
      }}
    >
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 2 }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 3 }}
          >
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Form schema={loginSchema} handler={handleSubmit}>
            <Input name={"email"} />
            <Input name={"password"} type="password" />
          </Form>

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
              to={"/auth/register"}
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontSize: "1.2rem",
              }}
            >
              Registrarse
            </Link>
            <Link
              to={"/auth/password"}
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontSize: "1.2rem",
              }}
            >
              Recuperar contraseña
            </Link>
          </Box>
        </Paper>
      </Box>

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