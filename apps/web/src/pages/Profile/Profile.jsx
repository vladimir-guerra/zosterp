import { useTranslation } from "react-i18next";
import { useAuth } from "../../providers/AuthProvider";
import { 
  Button, 
  TextField, 
  Box, 
  Paper, 
  Typography, 
  Divider 
} from "@mui/material";

export default function Profile() {
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3 // Espaciado uniforme entre los elementos
        }}
      >
        {/* Cabecera del apartado */}
        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold" color="primary.main">
            {t("profile", "Mi Perfil")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("profile-desc", "Gestiona tu información personal")}
          </Typography>
        </Box>

        <Divider />

        {/* Campos del formulario */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label={t("name", "Nombre")} variant="outlined" fullWidth disabled />
          <TextField label={t("email", "Email")} variant="outlined" fullWidth disabled />
          <TextField label={t("phone", "Teléfono")} variant="outlined" fullWidth disabled />
        </Box>

        {/* Botón de acción */}
        <Box sx={{ mt: 2 }}>
          <Button 
            onClick={() => logout()} 
            variant="contained" 
            color="error" 
            fullWidth
            sx={{ py: 1.5, fontWeight: 'bold' }}
          >
            {t("logout", "Cerrar sesión")}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}