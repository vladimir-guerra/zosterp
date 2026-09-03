import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import { useTask } from "../../../providers/TaskProvider";

function TaskDetailDialog({ task, companyId, open, onClose }) {
  const { t } = useTranslation("web");
  const { updateTask, deleteTask } = useTask();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(task || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(task || {});
    setIsEditing(false);
  }, [task]);

  if (!task) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setIsEditing(false);
    setFormData(task);
    onClose();
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateTask(companyId, task.id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(companyId, task.id);
      onClose();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {t("Task details", "Detalle de la Tarea")}
      </DialogTitle>

      <DialogContent dividers>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label={t("Title", "Título")}
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
          />
          <TextField
            label={t("Description", "Descripción")}
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            multiline
            minRows={3}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button color="error" variant="outlined" onClick={handleDelete}>
          {t("delete", "Eliminar")}
        </Button>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={handleEditToggle} color="inherit">
            {isEditing ? t("cancel", "Cancelar") : t("edit", "Editar")}
          </Button>

          {isEditing && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? t("saving", "Guardando...") : t("save", "Guardar")}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default function TaskDashboard() {
  const { t } = useTranslation("web");
  const navigate = useNavigate();
  const { tasks, fetchTasks, isLoading } = useTask();
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get("parentId");
  const { id: companyId } = useParams();
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (companyId) {
      fetchTasks(companyId);
    }
  }, [companyId, fetchTasks]);

  const visibleTasks = tasks.filter((task) => {
    if (parentId) return task.parentId === parentId;
    return !task.parentId;
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, alignItems: 'center' }}>
        {parentId && (
          <Button variant="outlined" onClick={() => navigate(-1)}>
            {t("back-to-parent-task", "Volver a la tarea superior")}
          </Button>
        )}
        <Button
          component={Link}
          to={parentId ? `new?parentId=${parentId}` : "new"}
          variant="contained"
          color="primary"
        >
          {t("add", "Agregar Tarea")}
        </Button>
      </Box>

      <Box component="main" sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        {isLoading ? (
          <CircularProgress sx={{ mt: 4 }} />
        ) : visibleTasks.length > 0 ? (
          <Grid container spacing={4} sx={{ width: '100%' }}>
            {visibleTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent
                    sx={{ flexGrow: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                    onClick={() => setSelectedTask(task)}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                    <Button size="small" color="primary" onClick={() => navigate(`?parentId=${task.id}`)}>
                      {t("associate", "Asociar")}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography textAlign="center" color="text.secondary" mt={4}>
            {t("no-tasks", "No hay tareas aquí.")}
          </Typography>
        )}
      </Box>

      <TaskDetailDialog
        task={selectedTask}
        companyId={companyId}
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
      />
    </Box>
  );
}