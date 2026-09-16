import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Avatar,
  Chip
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function Associate() {
  const { t } = useTranslation("web");
  const { id: companyId } = useParams();

  const [associates, setAssociates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (companyId) {
      setIsLoading(true);
      setTimeout(() => {
        setAssociates([]);
        setIsLoading(false);
      }, 800);
    }
  }, [companyId]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          {t("Associates", "Asociados")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
        >
          {t("Invite", "Invitar")}
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : associates.length > 0 ? (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 600 }} aria-label="associates table">
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell>{t("User", "Usuario")}</TableCell>
                <TableCell>{t("Email", "Correo")}</TableCell>
                <TableCell>{t("Role", "Rol")}</TableCell>
                <TableCell align="right">{t("Actions", "Acciones")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {associates.map((associate) => (
                <TableRow
                  key={associate.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {associate.nombre?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {associate.nombre || "Usuario Invitado"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{associate.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={associate.role?.name === 'adminTask' ? 'Administrador' : 'Asociado'}
                      size="small"
                      color={associate.role?.name === 'adminTask' ? 'secondary' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" color="error">
                      {t("Remove", "Quitar")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'grey.400',
            bgcolor: 'grey.50'
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t("no-associates", "Aún no tienes asociados")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("no-associates-desc", "Invita a miembros de tu equipo para comenzar a colaborar.")}
          </Typography>
          <Button variant="outlined" startIcon={<PersonAddIcon />}>
            {t("Invite your first associate", "Invitar al primer asociado")}
          </Button>
        </Paper>
      )}
    </Box>
  );
}