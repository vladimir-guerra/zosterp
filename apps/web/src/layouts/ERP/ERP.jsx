import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box 
} from "@mui/material";

export default function ERP() {
  const { t } = useTranslation("web");
  const currentDate = new Date();
  const Year = `${currentDate.getFullYear()}`;

  return (
    // Contenedor principal que abarca toda la pantalla
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
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'grey.200'
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main', textDecoration: 'none' }}
          >
            ZostERP
          </Typography>
          
          {/* Navegación transformada en botones de MUI */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to="/erp/profile"
              variant="text" // 'text' queda limpio para barras de navegación
              color="primary"
              sx={{ fontWeight: 'bold' }}
            >
              {t("profile")}
            </Button>
            <Button
              component={Link}
              to="/erp"
              variant="text"
              color="primary"
              sx={{ fontWeight: 'bold' }}
            >
              {t("companies")}
            </Button>
            
            {/* Opcional: Botón de Logout si lo necesitas globalmente */}
            {/* <Button component={Link} to="/auth/logout" variant="outlined" color="error">
              {t("logout")}
            </Button> 
            */}
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- MAIN CONTENT (Outlet) --- */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, // Esto obliga al contenedor a empujar el footer hacia abajo
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Todo lo que las rutas hijas rendericen aparecerá aquí adentro */}
        <Outlet />
      </Box>

      {/* --- FOOTER --- */}
      <Box
        component="footer"
        sx={{
          bgcolor: 'primary.dark',
          color: 'white',
          py: 4,
          textAlign: 'center',
          mt: 'auto'
        }}
      >
        <Typography variant="h6" gutterBottom>Contact</Typography>
        <Typography>zost.erp.support@gmail.com</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          &copy; {Year} Fiscella&Asociados. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}