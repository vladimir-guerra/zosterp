import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTaskTracking } from "../../../providers/TaskTrackingProvider.jsx";

export default function CreateTimesheetModal({ open, onClose, companyId, onSuccess }) {
  const { t } = useTranslation("web");
  const { assignments = [], isLoading, fetchAssignments, createTimesheet } = useTaskTracking();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    taskId: "",
    assignmentId: "",
    startedAt: "",
    finishedAt: ""
  });

  useEffect(() => {
    if (open && companyId) {
      const loadTasks = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/company/${companyId}/tasks`, {
            credentials: "include"
          });
          const data = await res.json();
          setTasks(data.data || data.tasks || []);
        } catch (error) {
          console.error("Error cargando tareas:", error);
        }
      };
      loadTasks();
    }
  }, [open, companyId]);

  const handleTaskChange = (e) => {
    const selectedTaskId = e.target.value;
    setFormData({ ...formData, taskId: selectedTaskId, assignmentId: "" });
    if (selectedTaskId) {
      fetchAssignments(selectedTaskId);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      await createTimesheet(formData, companyId);
      setFormData({ taskId: "", assignmentId: "", startedAt: "", finishedAt: "" });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al crear timesheet:", error);
      alert("Error al registrar el tiempo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Nuevo Registro de Tiempo
        <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FormControl fullWidth required>
          <InputLabel>Seleccionar Tarea</InputLabel>
          <Select
            name="taskId"
            value={formData.taskId}
            onChange={handleTaskChange}
            label={"Seleccionar Tarea"}
          >
            <MenuItem value="" disabled>Elige una tarea...</MenuItem>
            {tasks?.map((task) => (
              <MenuItem key={task.id} value={task.id}>
                {task.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth required disabled={!formData.taskId || isLoading}>
          <InputLabel>{"Responsable (Asignado)"}</InputLabel>
          <Select
            name="assignmentId"
            value={formData.assignmentId}
            onChange={handleInputChange}
            label={"Responsable (Asignado)"}
          >
            {assignments?.length === 0 ? (
              <MenuItem value="" disabled>No hay asociados en esta tarea</MenuItem>
            ) : (
              assignments?.map((assignment) => (
                <MenuItem key={assignment.id} value={assignment.id}>
                  {assignment.Associate?.User?.name} {assignment.Associate?.User?.lastName}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label={"Fecha y hora de inicio"}
            name="startedAt"
            type="datetime-local"
            value={formData.startedAt}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={"Fecha y hora de fin"}
            name="finishedAt"
            type="datetime-local"
            value={formData.finishedAt}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            helperText={"Opcional (Dejar vacío si está en curso)"}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          {"Cancelar"}
        </Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!formData.taskId || !formData.assignmentId || !formData.startedAt || isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Guardar Registro"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}