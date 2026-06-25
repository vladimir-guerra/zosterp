import { useForm } from "react-hook-form";
import { Form, Input } from "../../components";
import { insertUserSchema } from "@repo/schemas";
import { useTranslation } from "react-i18next";

// Nuevas importaciones de Material UI para la estructura
import { Box, AppBar, Toolbar, Typography, Paper } from "@mui/material";
import React from "react";

export default function RequestPassword() {
  const { t } = useTranslation("web");
  const handleSubmit = (data) => { };
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
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 2 }}>

            <Form schema={insertUserSchema} handler={handleSubmit}>
              <Typography variant="h4">{t("Request-password")}</Typography>
              <Input name={"email"} />
            </Form>

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
