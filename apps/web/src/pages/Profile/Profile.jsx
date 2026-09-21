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
  const user = {}
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
            Mi Perfil
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Información del usuario
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            label="Nombre"
            variant="outlined" 
            fullWidth 
            disabled 
            value={user?.name} 
          />
          <TextField 
            label="Apellido" 
            variant="outlined" 
            fullWidth 
            disabled 
            value={user?.surname || ""} 
          />
          <TextField 
            label="Email" 
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
            Cerrar sesión
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}