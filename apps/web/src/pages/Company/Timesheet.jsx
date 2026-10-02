import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Chip,
  LinearProgress
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAssociates } from "../../providers/AssociatesProvider.jsx";
import { useTask } from "../../providers/TaskProvider.jsx";

const DATE_OPTIONS = { year: "numeric", month: "short", day: "numeric" };

const formatDate = (dateString) => {
  if (!dateString) return "Sin definir";
  return new Date(dateString).toLocaleDateString("es-AR", DATE_OPTIONS);
};

const getScheduleStatus = (progress, approximateFinishDate, finishedAt) => {
  if (progress === 100 || finishedAt) {
    if (approximateFinishDate && new Date(finishedAt) > new Date(approximateFinishDate)) {
      return { label: "Completada con retraso", color: "warning" };
    }
    return { label: "Completada a tiempo", color: "success" };
  }

  if (approximateFinishDate && new Date() > new Date(approximateFinishDate)) {
    return { label: "Atrasada", color: "error" };
  }

  if (progress > 0) {
    return { label: "En curso (En plazo)", color: "primary" };
  }

  return { label: "Pendiente", color: "default" };
};

export default function Timesheet() {

  const { id: companyId } = useParams();
  const navigate = useNavigate();
  const { tasks = [], isLoading, fetchTasks } = useTask();
  const { canManageTasks, associates = [], fetchAssociates } = useAssociates();

  useEffect(() => {
    if (companyId) {
      fetchTasks(companyId);
      if (associates.length === 0) {
        fetchAssociates();
      }
    }
  }, [companyId, associates.length, fetchTasks, fetchAssociates]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Seguimiento de Plazos y Estimaciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            El progreso y la fecha de finalización se calculan automáticamente al completar los ítems del checklist de cada tarea.
          </Typography>
        </Box>
      </Box>

      {isLoading && tasks.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length > 0 ? (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                <TableCell>Tarea</TableCell>
                <TableCell>Inicio</TableCell>
                <TableCell>Fin Estimado</TableCell>
                <TableCell>Cierre Real</TableCell>
                <TableCell sx={{ width: 200 }}>Progreso (Checklist)</TableCell>
                <TableCell align="center">Estado del Plazo</TableCell>
                <TableCell align="right">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => {
                const checklist = Array.isArray(task.checklist) ? task.checklist : [];
                const totalItems = checklist.length;
                const completedItems = checklist.filter((i) => i.completed).length;
                const progress =
                  totalItems > 0
                    ? Math.round((completedItems / totalItems) * 100)
                    : task.percentDone || 0;

                const status = getScheduleStatus(
                  progress,
                  task.approximateFinishDate || task.approximate_finish_date,
                  task.finishedAt || task.finished_at
                );

                return (
                  <TableRow key={task.id} hover>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {task.title}
                    </TableCell>
                    <TableCell>
                      {formatDate(task.startedAt || task.started_at)}
                    </TableCell>
                    <TableCell>
                      {formatDate(task.approximateFinishDate || task.approximate_finish_date)}
                    </TableCell>
                    <TableCell>
                      {task.finishedAt || task.finished_at
                        ? formatDate(task.finishedAt || task.finished_at)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: "100%" }}>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            color={progress === 100 ? "success" : "primary"}
                            sx={{ height: 7, borderRadius: 4 }}
                          />
                        </Box>
                        <Typography variant="caption" fontWeight="bold" sx={{ minWidth: 45 }}>
                          {progress}% ({completedItems}/{totalItems})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={status.label}
                        size="small"
                        color={status.color}
                        variant={status.color === "default" ? "outlined" : "filled"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon fontSize="small" />}
                        onClick={() => navigate(`../tasks?taskId=${task.id}`)}
                      >
                        Ver Checklist
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "grey.400",
            bgcolor: "grey.50"
          }}
        >
          <EventNoteIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay tareas planificadas todavía
          </Typography>
          {canManageTasks && (
            <Button
              variant="contained"
              onClick={() => navigate(`/company/${companyId}/tasks/new`)}
              sx={{ mt: 1 }}
            >
              Crear primera tarea
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
}