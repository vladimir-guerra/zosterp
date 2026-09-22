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

export default function EditTimesheetModal({ open, onClose, companyId, record, onSuccess }) {
  const { t } = useTranslation("web");
  const { updateTimesheet, assignments = [], fetchAssignments, isLoading } = useTaskTracking();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editData, setEditData] = useState({ id: "", assignmentId: "", startedAt: "", finishedAt: "" });

  useEffect(() => {
    if (record && open) {
      setEditData({
        id: record.id,
        assignmentId: record.assignmentId || record.assignment_id || "",
        startedAt: record.startedAt ? new Date(record.startedAt).toISOString().slice(0, 16) : "",
        finishedAt: record.finishedAt ? new Date(record.finishedAt).toISOString().slice(0, 16) : ""
      });

      const taskId = record.taskId || record.task_id;
      if (taskId) {
        fetchAssignments(taskId);
      }
    }
  }, [record, open, fetchAssignments]);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      console.log(editData.assignmentId);
      
      await updateTimesheet({
        id: editData.id,
        assignmentId: editData.assignmentId, 
        startedAt: editData.startedAt,
        finishedAt: editData.finishedAt || null
      }, companyId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el registro");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Editar Tiempos y Responsable
        <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        <FormControl fullWidth required disabled={isLoading}>
          <InputLabel>{"Responsable (Asignado)"}</InputLabel>
          <Select
            name="assignmentId"
            value={editData.assignmentId}
            onChange={handleEditChange}
            label={"Responsable (Asignado)"}
          >
            {assignments?.length === 0 ? (
              <MenuItem value="" disabled>Cargando o no hay asociados en esta tarea...</MenuItem>
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
            value={editData.startedAt}
            onChange={handleEditChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={"Fecha y hora de fin"}
            name="finishedAt"
            type="datetime-local"
            value={editData.finishedAt}
            onChange={handleEditChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            helperText={"Opcional (Dejar vacío si está en curso)"}
          />
        </Box>

      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={!editData.startedAt || !editData.assignmentId || isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Actualizar Registro"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}