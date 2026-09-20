import { useEffect } from "react";
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
import TimerIcon from "@mui/icons-material/Timer";
import GetAppIcon from "@mui/icons-material/GetApp";

import { useTaskTracking } from "../../providers/TaskTrackingProvider.jsx";

export default function Timesheet() {
  const { t } = useTranslation("web");
  const { id: companyId } = useParams();

  const { timesheets, isLoading, fetchTimesheets } = useTaskTracking();

  useEffect(() => {
    if (companyId) {
      fetchTimesheets(""); 
    }
  }, [companyId, fetchTimesheets]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDuration = (start, end) => {
    if (!end) return t("En curso...");
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          {t("Timesheets", "Cronograma de estimación")}
        </Typography>
        <Button variant="outlined" startIcon={<GetAppIcon />} disabled={timesheets.length === 0}>
          {t("Exportar")}
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : timesheets.length > 0 ? (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 700 }} aria-label="timesheet table">
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell>{t("Tarea")}</TableCell>
                <TableCell>{t("Responsable")}</TableCell>
                <TableCell>{t("Inicio")}</TableCell>
                <TableCell>{t("Fin")}</TableCell>
                <TableCell align="right">{t("Duración")}</TableCell>
                <TableCell align="center">{t("Estado")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timesheets.map((record) => (
                <TableRow key={record.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 'medium' }}>
                    {record.Task?.title || t("Tarea desconocida")}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main', fontSize: '0.875rem' }}>
                        {record.Assignment?.Associate?.User?.name?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Typography variant="body2">
                        {record.Assignment?.Associate?.User?.name || "Usuario"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(record.startedAt || record.started_at)}</TableCell>
                  <TableCell>{formatDate(record.finishedAt || record.finished_at)}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {calculateDuration(record.startedAt || record.started_at, record.finishedAt || record.finished_at)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {record.finishedAt || record.finished_at ? (
                      <Chip label={t("Finalizado")} size="small" color="success" variant="outlined" />
                    ) : (
                      <Chip label={t("En ejecución")} size="small" color="primary" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 2, border: '1px dashed', borderColor: 'grey.400', bgcolor: 'grey.50' }}>
          <TimerIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t("No hay registros de tiempo")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("Los tiempos registrados por los asociados aparecerán aquí.")}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}