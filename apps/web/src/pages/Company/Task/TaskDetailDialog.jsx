import { useEffect, useState, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  LinearProgress,
  Checkbox
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useTask } from "../../../providers/TaskProvider.jsx";
import { useTaskTracking } from "../../../providers/TaskTrackingProvider.jsx";
import { useAssociates } from "../../../providers/AssociatesProvider.jsx";

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ minHeight: "350px" }} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function TaskDetailDialog({ task, companyId, open, onClose, onDelete, defaultEditMode = false }) {
  const { updateTask, deleteTask } = useTask();
  const {
    assignments = [],
    fetchAssignments,
    createAssignment,
    deleteAssignment,
    isLoading: trackingLoading
  } = useTaskTracking();
  const { associates = [], fetchAssociates, canManageTasks } = useAssociates();

  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(task || {});
  const [saving, setSaving] = useState(false);
  const [selectedAssociateToAssign, setSelectedAssociateToAssign] = useState("");

  const [checklist, setChecklist] = useState(Array.isArray(task?.checklist) ? task.checklist : []);
  const [newItemText, setNewItemText] = useState("");
  const [updatingChecklist, setUpdatingChecklist] = useState(false);

  const loadedTeamTaskIdRef = useRef(null);

  useEffect(() => {
    if (open && task) {
      setIsEditing(canManageTasks ? defaultEditMode : false);
      setFormData(task);
      setChecklist(Array.isArray(task.checklist) ? task.checklist : []);
    }
  }, [open, task, defaultEditMode, canManageTasks]);

  useEffect(() => {
    if (!open || !task?.id) {
      loadedTeamTaskIdRef.current = null;
      return;
    }

    if (tabValue === 2 && loadedTeamTaskIdRef.current !== task.id) {
      loadedTeamTaskIdRef.current = task.id;
      fetchAssignments(task.id);

      if (associates.length === 0) {
        fetchAssociates();
      }
    }
  }, [open, tabValue, task?.id, associates.length, fetchAssignments, fetchAssociates]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleTabChange = (e, newValue) => setTabValue(newValue);

  const handleClose = () => {
    setIsEditing(false);
    setSelectedAssociateToAssign("");
    setNewItemText("");
    setTabValue(0);
    loadedTeamTaskIdRef.current = null;
    onClose();
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      setFormData(task || {});
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveTask = async (e) => {
    e?.preventDefault();
    if (!canManageTasks) return;
    try {
      setSaving(true);
      await updateTask(companyId, task.id, {
        title: formData.title,
        description: formData.description
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCurrentTask = async () => {
    if (!canManageTasks || !task) return;

    if (onDelete) {
      onDelete(task);
      return;
    }

    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      try {
        setSaving(true);
        await deleteTask(companyId, task.id);
        handleClose();
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  const progress = useMemo(() => {
    if (checklist.length === 0) return 0;
    const completedCount = checklist.filter((item) => item.completed).length;
    return Math.round((completedCount / checklist.length) * 100);
  }, [checklist]);

  const syncChecklist = async (updatedList) => {
    const previousList = checklist;
    setChecklist(updatedList);
    setUpdatingChecklist(true);
    try {
      await updateTask(companyId, task.id, { checklist: updatedList });
    } catch (error) {
      console.error("Error al guardar el checklist:", error);
      setChecklist(previousList);
    } finally {
      setUpdatingChecklist(false);
    }
  };

  const handleAddChecklistItem = (e) => {
    e.preventDefault();
    if (!canManageTasks || !newItemText.trim()) return;

    const newItem = {
      id: crypto.randomUUID(),
      text: newItemText.trim(),
      completed: false
    };

    setNewItemText("");
    syncChecklist([...checklist, newItem]);
  };

  const handleToggleChecklistItem = (itemId) => {
    const updatedList = checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    syncChecklist(updatedList);
  };

  const handleDeleteChecklistItem = (itemId) => {
    if (!canManageTasks) return;
    const updatedList = checklist.filter((item) => item.id !== itemId);
    syncChecklist(updatedList);
  };

  const handleAssignAssociate = async () => {
    if (!canManageTasks || !selectedAssociateToAssign) return;
    try {
      await createAssignment(companyId, task.id, { associateId: selectedAssociateToAssign });
      setSelectedAssociateToAssign("");
    } catch (error) {
      console.error("Error al asignar asociado:", error);
    }
  };

  const unassignedAssociates = useMemo(() => {
    return associates.filter((assoc) => {
      return !assignments.some((assignment) => {
        const assignedAssocId =
          assignment.associateId ||
          assignment.associate_id ||
          assignment.Associate?.id;
        const assignedUserId =
          assignment.Associate?.userId ||
          assignment.Associate?.user_id ||
          assignment.Associate?.User?.id;

        return (
          (assignedAssocId && assignedAssocId === assoc.id) ||
          (assignedUserId && assignedUserId === (assoc.userId || assoc.user_id))
        );
      });
    });
  }, [associates, assignments]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: "bold", position: "relative" }}>
        {task?.title || "Detalle de la Tarea"}
        <IconButton aria-label="close" onClick={handleClose} size="small" color="error" sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Información" />
            <Tab label={`Checklist (${progress}%)`} />
            <Tab label="Equipo" />
          </Tabs>
        </Box>

        <CustomTabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleSaveTask} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Título"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              disabled={!isEditing || !canManageTasks || saving}
              InputLabelProps={{ shrink: true }}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="Descripción"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              disabled={!isEditing || !canManageTasks || saving}
              InputLabelProps={{ shrink: true }}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              multiline
              minRows={4}
            />
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={1}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Progreso de la tarea
            </Typography>
            <Typography variant="body2" fontWeight="bold" color={progress === 100 ? "success.main" : "primary"}>
              {progress}%
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            color={progress === 100 ? "success" : "primary"}
            sx={{ height: 10, borderRadius: 5, mb: 3 }}
          />

          {canManageTasks && (
            <>
              <Box component="form" onSubmit={handleAddChecklistItem} sx={{ display: "flex", gap: 1.5, mb: 3 }}>
                <TextField
                  size="small"
                  placeholder="Añadir un ítem a la lista..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  disabled={updatingChecklist}
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={!newItemText.trim() || updatingChecklist}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Añadir
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </>
          )}

          <List disablePadding>
            {checklist.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                No hay ítems en el checklist de esta tarea.
              </Typography>
            ) : (
              checklist.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    bgcolor: item.completed ? "grey.50" : "background.paper",
                    mb: 1,
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: item.completed ? "transparent" : "grey.200"
                  }}
                  secondaryAction={
                    canManageTasks && (
                      <IconButton
                        edge="end"
                        size="small"
                        color="error"
                        onClick={() => handleDeleteChecklistItem(item.id)}
                        disabled={updatingChecklist}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )
                  }
                >
                  <Checkbox
                    edge="start"
                    checked={Boolean(item.completed)}
                    onChange={() => handleToggleChecklistItem(item.id)}
                    disabled={updatingChecklist}
                    color="success"
                  />
                  <ListItemText
                    primary={item.text}
                    sx={{
                      textDecoration: item.completed ? "line-through" : "none",
                      color: item.completed ? "text.secondary" : "text.primary"
                    }}
                  />
                </ListItem>
              ))
            )}
          </List>
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={2}>
          {trackingLoading ? (
            <CircularProgress size={30} />
          ) : (
            <>
              {canManageTasks && (
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <FormControl fullWidth size="small" disabled={unassignedAssociates.length === 0}>
                    <InputLabel>
                      {unassignedAssociates.length === 0
                        ? "Todos los asociados ya están asignados"
                        : "Seleccionar Asociado"}
                    </InputLabel>
                    <Select
                      value={selectedAssociateToAssign}
                      label={
                        unassignedAssociates.length === 0
                          ? "Todos los asociados ya están asignados"
                          : "Seleccionar Asociado"
                      }
                      onChange={(e) => setSelectedAssociateToAssign(e.target.value)}
                    >
                      {unassignedAssociates.map((assoc) => (
                        <MenuItem key={assoc.id} value={assoc.id}>
                          {assoc.User?.name} {assoc.User?.surname} ({assoc.User?.email})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleAssignAssociate}
                    disabled={!selectedAssociateToAssign || unassignedAssociates.length === 0}
                  >
                    Asignar
                  </Button>
                </Box>
              )}

              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                Miembros Actuales
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List>
                {assignments.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    Nadie ha sido asignado a esta tarea aún.
                  </Typography>
                ) : (
                  assignments.map((assignment) => (
                    <ListItem key={assignment.id} sx={{ bgcolor: "background.paper", mb: 1, borderRadius: 1, border: "1px solid #eee" }}>
                      <ListItemText
                        primary={`${assignment.Associate?.User?.name || ""} ${assignment.Associate?.User?.surname || ""}`}
                        secondary={
                          (() => {
                            const roleName =
                              assignment.Role?.name ||
                              assignment.Associate?.Role?.name ||
                              assignment.Associate?.User?.Role?.name;

                            if (roleName === "owner") return "Dueño";
                            if (roleName === "adminTask") return "Administrador de tareas";
                            return "Asociado";
                          })()
                        }
                      />
                      {canManageTasks && (
                        <IconButton color="error" onClick={() => deleteAssignment(companyId, assignment.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </ListItem>
                  ))
                )}
              </List>
            </>
          )}
        </CustomTabPanel>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 2, display: "flex", justifyContent: "space-between" }}>
        {tabValue === 0 && canManageTasks && (
          <>
            <Button
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteCurrentTask}
              disabled={saving}
            >
              Eliminar
            </Button>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button onClick={handleToggleEdit} color="inherit" disabled={saving}>
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
              {isEditing && (
                <Button variant="contained" color="primary" onClick={handleSaveTask} disabled={saving}>
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
              )}
            </Box>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}