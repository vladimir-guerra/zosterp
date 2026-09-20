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
  const { user, logout } = useAuth(); 
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
          gap: 3 
        }}
      >
        {/* Cabecera del apartado */}
        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold" color="primary.main">
            {t("Mi Perfil")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("Información del usuario")}
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            label={t("Nombre")} 
            variant="outlined" 
            fullWidth 
            disabled 
            value={user?.name} 
          />
          <TextField 
            label={t("Apellido")} 
            variant="outlined" 
            fullWidth 
            disabled 
            value={user?.surname || ""} 
          />
          <TextField 
            label={t("Email")} 
            variant="outlined" 
            fullWidth 
            disabled 
            value={user?.email || "No registrado"} 
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button 
            onClick={() => logout()} 
            variant="contained" 
            color="error" 
            fullWidth
            sx={{ py: 1.5, fontWeight: 'bold' }}
          >
            {t("Cerrar sesión")}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}