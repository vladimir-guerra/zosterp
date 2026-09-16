import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText

} from "@mui/material";

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTask } from "../../../providers/TaskProvider";
import CustomCard from "../../../components/Card/Card.jsx";

function TaskDetailDialog({ task, companyId, open, onClose, defaultEditMode = false }) {

  const { t } = useTranslation("web");
  const { updateTask, deleteTask } = useTask();
  const [isEditing, setIsEditing] = useState(defaultEditMode);
  const [formData, setFormData] = useState(task || {});
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    setFormData(task || {});
    setIsEditing(defaultEditMode);
  }, [task, defaultEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setIsEditing(false);
    if (task) setFormData(task);
    onClose();
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateTask(companyId, task.id, formData);
      setIsEditing(true);
      onClose();
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
      <DialogTitle sx={{ fontWeight: "bold", position: "relative" }}>
        {t("Task details", "Detalle de la Tarea")}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          size="small"
          color="error"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
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
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={handleEditToggle} color="inherit">
            {isEditing ? t("cancel", "Cancelar") : t("edit", "Editar")}
          </Button>

          {isEditing && (
            <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
              {saving ? t("saving", "Guardando...") : t("save", "Guardar")}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}

function TaskCardItem({ task, onEdit, onDelete, onAddSubtask, onViewSubtasks }) {
  const { t } = useTranslation("web");
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const executeAction = (actionFn) => {
    handleMenuClose();
    actionFn(task);
  };

  return (
    <CustomCard id={task.id} onMenuClick={handleMenuClick}>
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
        <MenuItem onClick={() => executeAction(onEdit)}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{t("view", "Detalle")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => executeAction(onDelete)} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>{t("delete", "Eliminar")}</ListItemText>
        </MenuItem>
      </Menu>
      <Box sx={{ flexGrow: 1, pr: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
          {task.title}
        </Typography>
        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description}
          </Typography>
        )}
        <Box>
          <Button size="small" color="primary" onClick={() => onViewSubtasks(task)}>
            {t("content", "Contenido")}
          </Button>
        </Box>
      </Box>
    </CustomCard>
  );
}


export default function TaskDashboard() {
  const { t } = useTranslation("web");
  const navigate = useNavigate();
  const { tasks, fetchTasks, isLoading, deleteTask } = useTask();
  const [searchParams, setSearchParams] = useSearchParams();
  const parentId = searchParams.get("parentId");
  const editTaskId = searchParams.get("taskId");
  const { id: companyId } = useParams();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDialogEditMode, setIsDialogEditMode] = useState(false);

  useEffect(() => {
    if (companyId) {
      fetchTasks(companyId);
    }
  }, [companyId, fetchTasks]);

  useEffect(() => {
    if (editTaskId && tasks.length > 0) {
      const taskFound = tasks.find(t => t.id === editTaskId);
      if (taskFound) {
        setSelectedTask(taskFound);
        setIsDialogEditMode(false);
      } else if (!editTaskId) {
        setSelectedTask(null);
      }
    }
  }, [editTaskId, tasks]);


  const visibleTasks = tasks.filter((task) => {
    if (parentId) return task.parentId === parentId;
    return !task.parentId;
  });

  const handleEditTask = (task) => {
    setIsDialogEditMode(false);

    setSearchParams((prevParams) => {
      prevParams.set("taskId", task.id);
      return prevParams
    });
  };

  const handleCloseDialog = () => {
    setIsDialogEditMode(false);
    setSelectedTask(null);

    const newParams = new URLSearchParams(searchParams);
    newParams.delete("taskId");
    setSearchParams(newParams);
  };

  const handleAddSubtask = (task) => {
    navigate(`new?parentId=${task.id}`);
  };

  const handleDeleteTask = async (task) => {
    if (window.confirm(t("confirm-delete", "¿Estás seguro de que deseas eliminar esta tarea?"))) {
      try {
        await deleteTask(companyId, task.id);
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
      }
    }
  };

  const handleViewSubtasks = (task) => {
    navigate(`?parentId=${task.id}`);
  };

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
              <TaskCardItem
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onAddSubtask={handleAddSubtask}
                onDelete={handleDeleteTask}
                onViewSubtasks={handleViewSubtasks}
              />
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
        defaultEditMode={isDialogEditMode}
        onClose={handleCloseDialog}
      />
    </Box>
  );
} 