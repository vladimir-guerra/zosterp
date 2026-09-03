import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Card,
  CardContent,
  CardMedia
} from "@mui/material";
import img_background from "../../../src/assets/fonts/images/landpage-bg-image.jpg";
import features from "./features.json"

export default function Landpage() {
  const { t } = useTranslation("web");
  const currentDate = new Date();
  const Year = `${currentDate.getFullYear()}`;
  return (
    <Box sx={{ bgcolor: 'common.white', minHeight: '100vh' }}>
      {/* --- NAVEGACIÓN --- */}
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
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}
          >
            ZostERP
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to="/auth/login"
              variant="contained"
              color="primary"
            >
              {t("login")}
            </Button>
            <Button
              component={Link}
              to="/auth/register"
              variant="contained"
              color="primary"
            >
              {t("register")}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- HERO SECTION (Fondo estático con imagen) --- */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `url(${img_background})`, // Asegúrate de tener esta imagen en la carpeta public o ajusta la ruta según corresponda
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // Esto hace que la imagen se quede estática al hacer scroll
          color: 'white',
          py: { xs: 12, md: 20 },
          textAlign: 'center',
          '&::before': {
            // Capa superpuesta azul para mejorar la lectura del texto
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(3, 41, 118, 0.29)',
            zIndex: 1,
          }
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 900, letterSpacing: 4, textShadow: '2px 2px 4px rgba(0,0,0,0.67)' }}>
            ZostERP
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: '600px', mx: 'auto', mb: 4, fontWeight: 'regular', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.90)' }}>
            La alternativa más simple, rápida y eficáz para la administración de tu PyME.
          </Typography>
        </Container>
      </Box>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <Box component="main" sx={{ py: 10 }}>

        {/* --- SECCIÓN DE CARACTERÍSTICAS --- */}
        <Container>
          <Box textAlign="center" mb={8}>
            <Typography variant="h3" component="h2" color="primary.dark" gutterBottom sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
              Características Principales
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '700px', py: 1, mb: 10}}>
              Nuestro sistema propone una serie de opciones para la gestión de su empresa, cubriendo las necesidades básicas administrativas y a su vez encaminando a la digitalización de su negocio. Permitiendo no solo despreocuparse en dónde y cómo va a guardar sus datos, sino que podrá acceder a ellos desde cualquier lugar y en cualquier momento. 
            </Typography> 
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'stretch',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              gap: { xs: 3, md: 4 }
            }}
          >
            {features.map((feature) => (
              <Card
                key={feature.id}
                elevation={0}
                sx={{
                  flex: 1, // Obliga a que todas las tarjetas tengan exactamente el mismo ancho
                  maxWidth: '240px', // Reduce el tamaño máximo ~20%
                  minWidth: '180px', // Límite para que el texto no se apelmace al achicar la ventana
                  border: '1px solid',
                  borderColor: 'grey.200',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'cente   ',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: 3 }
                }}
              >
                <CardMedia
                  component="img"
                  image={`${feature.img}-${feature.id}.png`}
                  alt={`Feature ${feature.id}`}
                  sx={{ height: '120px', width: '100%', objectFit: 'contain', p: 2, bgcolor: 'transparent' }}
                  
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  {/* Tamaños de fuente ligeramente ajustados para la carta reducida */}
                  <Typography variant="h6" color="primary.main" fontWeight="bold" gutterBottom sx={{ fontSize: '1.1rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>

        {/* SECCIÓN DE BENEFICIOS ADICIONALES */}
        <Box sx={{ bgcolor: 'primary.50', py: 8, mt: 10 }}>
          <Container>
            <Typography variant="h4" sx={{mb: 5}}>Ventajas al usar nuestro ERP</Typography>
            <Typography variant="body1" color="text.primary" align="center" sx={{ lineHeight: 1.8}}>
             La versatilidad de nuestro sistema le permitirá alcanzar los objetivos de su organización. Diseñado bajo los pilares de la simplicidad y la rapidez, podrá monitorear el rendimiento de su equipo al día, gestionar su facturación y obtener una vista panorámica de todo su negocio.
            </Typography>
          </Container>
        </Box>

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
  );
}