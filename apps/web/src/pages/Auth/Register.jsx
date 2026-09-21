import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Input } from "../../components";
import { insertUserSchema } from "@repo/schemas";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers";
import { Box, AppBar, Toolbar, Typography, Paper, Alert } from "@mui/material";

export default function Register() {
  const { auth, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    const result = await auth(data, true);
    if(result.to2FA)
      navigate(`/auth/2FA/${result.token}`)
    else
      navigate("/erp")
  };

  const date = new Date();
  const Year = `${date.getFullYear()}`;

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>

        <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 'bold' }}>
              ZostERP
            </Typography>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 2, justifyContent: 'center' }}>
            
            <Typography variant="h4" sx={{ mb: 2 }}>{"Registrarse"}</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Form schema={insertUserSchema} handler={handleSubmit}>
              <div style={{ display: "flex" }}>
                <Input name="name" />
                <Input name="surname" />
              </div>
              <Input name={"email"} />
              <Input name={"password"} type="password" />
              <Input name={"confirmPassword"} type="password" />
              
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
              </Box>
            </Form>
            
            <Link to={"/auth/login"} style={{ textDecoration: "none", color: "#1976d2", fontSize: "1.2rem", display: "flex", marginTop: "1rem" }}>
              Iniciar Sesión
            </Link>
          </Paper>
        </Box>

        {/* --- FOOTER --- */}
        <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', py: 4, textAlign: 'center' }}>
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