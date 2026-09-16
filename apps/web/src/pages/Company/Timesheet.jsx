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
import TimerIcon from "@mui/icons-material/Timer";
import GetAppIcon from "@mui/icons-material/GetApp";

export default function Timesheet() {
  const { t } = useTranslation("web");
  const { id: companyId } = useParams();

  const [timesheets, setTimesheets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // simulando una buena vida
  useEffect(() => {
    if (companyId) {
      setIsLoading(true);
      setTimeout(() => {
        setTimesheets([
          {
            id: "uuid-1",
            task: { title: "Encontrarle un sentido a la existencia" },
            user: { nombre: "Ernesto Sábato" },
            started_at: "2026-09-16T09:00:00Z",
            finished_at: "2026-09-16T12:30:00Z"
          },
          {
            id: "uuid-2",
            task: { title: "Vivir sin el temor de la opinión ajena" },
            user: { nombre: "Oscar Wilde" },
            started_at: "2026-09-16T14:15:00Z",
            finished_at: null 
          }
        ]);
        setIsLoading(false);
      }, 800);
    }
  }, [companyId]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDuration = (start, end) => {
    if (!end) return t("In progress", "En curso...");
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
        <Button 
          variant="outlined" 
          startIcon={<GetAppIcon />}
          disabled={timesheets.length === 0}
        >
          {t("Export", "Exportar")}
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
                <TableCell>{t("Task", "Tarea")}</TableCell>
                <TableCell>{t("Responsible", "Responsable")}</TableCell>
                <TableCell>{t("Start Time", "Inicio")}</TableCell>
                <TableCell>{t("End Time", "Fin")}</TableCell>
                <TableCell align="right">{t("Duration", "Duración")}</TableCell>
                <TableCell align="center">{t("Status", "Estado")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timesheets.map((record) => (
                <TableRow
                  key={record.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {/* Tarea */}
                  <TableCell sx={{ fontWeight: 'medium' }}>
                    {record.task?.title || t("Unknown Task", "Tarea desconocida")}
                  </TableCell>
                  
                  {/* Responsable */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main', fontSize: '0.875rem' }}>
                        {record.user?.nombre?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Typography variant="body2">
                        {record.user?.nombre || "Usuario"}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Inicio */}
                  <TableCell>{formatDate(record.started_at)}</TableCell>

                  {/* Fin */}
                  <TableCell>{formatDate(record.finished_at)}</TableCell>

                  {/* Duración */}
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {calculateDuration(record.started_at, record.finished_at)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {record.finished_at ? (
                      <Chip label={t("Completed", "Finalizado")} size="small" color="success" variant="outlined" />
                    ) : (
                      <Chip label={t("Running", "En ejecución")} size="small" color="primary" />
                    )}
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
          <TimerIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t("no-timesheets", "No hay registros de tiempo")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("no-timesheets-desc", "Los tiempos registrados por los asociados aparecerán aquí.")}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}