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
    CircularProgress
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

import { useTask } from "../../../providers/TaskProvider.jsx";
import { useTaskTracking } from "../../../providers/TaskTrackingProvider.jsx";
import { useAssociates } from "../../../providers/AssociatesProvider.jsx";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} style={{ minHeight: '350px' }} {...other}>
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}

export default function TaskDetailDialog({ task, companyId, open, onClose, defaultEditMode = false }) {
    const { t } = useTranslation("web");
    const { updateTask } = useTask();

    const { assignments, timesheets, fetchAssignments, fetchTimesheets, createAssignment, deleteAssignment, isLoading: trackingLoading } = useTaskTracking();
    const { associates } = useAssociates();

    const [tabValue, setTabValue] = useState(0);
    const [isEditing, setIsEditing] = useState(defaultEditMode);
    const [formData, setFormData] = useState(task || {});
    const [saving, setSaving] = useState(false);
    const [selectedAssociateToAssign, setSelectedAssociateToAssign] = useState("");

    useEffect(() => {
        if (open && task?.id) {
            setTabValue(0);
            setIsEditing(defaultEditMode);
            setFormData(task || {});
            fetchAssignments(task.id);
            fetchTimesheets(task.id);
        }
    }, [open, task, defaultEditMode, fetchAssignments, fetchTimesheets]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleTabChange = (e, newValue) => setTabValue(newValue);

    const handleClose = () => {
        setIsEditing(false);
        setSelectedAssociateToAssign("");
        onClose();
    };

    const handleSaveTask = async () => {
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

    const handleAssignAssociate = async () => {
        if (!selectedAssociateToAssign) return;
        try {
            await createAssignment(companyId, task.id, { associateId: selectedAssociateToAssign });
            setSelectedAssociateToAssign("");
        } catch (error) {
            console.error("Error al asignar asociado:", error);
        }
    };

    const unassignedAssociates = associates.filter(
        (assoc) => !assignments.some((assignment) => assignment.associateId === assoc.id)
    );

    const totalMilliseconds = timesheets.reduce((acc, current) => {
        if (!current.finishedAt && !current.finished_at) return acc;
        const start = new Date(current.startedAt || current.started_at);
        const end = new Date(current.finishedAt || current.finished_at);
        return acc + (end - start);
    }, 0);
    const totalHours = (totalMilliseconds / (1000 * 60 * 60)).toFixed(1);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ fontWeight: "bold", position: "relative" }}>
                {task?.title || t("Detalle de la Tarea")}
                <IconButton aria-label="close" onClick={handleClose} size="small" color="error" sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 0 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="task details tabs">
                        <Tab label={t("Información")} />
                        <Tab label={t("Equipo")} />
                        <Tab label={t("Tiempos")} />
                    </Tabs>
                </Box>

                <CustomTabPanel value={tabValue} index={0}>
                    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <TextField label={t("Título")} name="title" value={formData.title || ""} onChange={handleChange} disabled={!isEditing} fullWidth />
                        <TextField label={t("Descripción")} name="description" value={formData.description || ""} onChange={handleChange} disabled={!isEditing} fullWidth multiline minRows={4} />
                    </Box>
                </CustomTabPanel>

                <CustomTabPanel value={tabValue} index={1}>
                    {trackingLoading ? <CircularProgress size={30} /> : (
                        <>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>{t("Seleccionar Asociado")}</InputLabel>
                                    <Select
                                        value={selectedAssociateToAssign}
                                        label={t("Seleccionar Asociado")}
                                        onChange={(e) => setSelectedAssociateToAssign(e.target.value)}
                                    >
                                        {unassignedAssociates.map((assoc) => (
                                            <MenuItem key={assoc.id} value={assoc.id}>
                                                {assoc.User?.name} {assoc.User?.lastName} ({assoc.User?.email})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button variant="contained" onClick={handleAssignAssociate} disabled={!selectedAssociateToAssign}>
                                    {t("Asignar")}
                                </Button>
                            </Box>

                            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>{t("Miembros Actuales")}</Typography>
                            <Divider sx={{ mb: 2 }} />

                            <List>
                                {assignments.length === 0 ? (
                                    <Typography variant="body2" color="textSecondary">{t("Nadie ha sido asignado a esta tarea aún.")}</Typography>
                                ) : (
                                    assignments.map((assignment) => (
                                        <ListItem key={assignment.id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1, border: '1px solid #eee' }}>
                                            <ListItemText
                                                primary={`${assignment.Associate?.User?.name || ''} ${assignment.Associate?.User?.surname || ''}`}
                                                secondary={assignment.Role?.name || "Asociado"}
                                            />
                                            <IconButton color="error" onClick={() => deleteAssignment(companyId, assignment.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </>
                    )}
                </CustomTabPanel>

                <CustomTabPanel value={tabValue} index={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">{t("Registro de Horas")}</Typography>
                        <Typography variant="subtitle1" color="primary" fontWeight="bold">
                            {t("Total")}: {totalHours} hrs
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {timesheets.length === 0 ? (
                            <Typography variant="body2" color="textSecondary">{t("No hay tiempos registrados en esta tarea.")}</Typography>
                        ) : (
                            timesheets.map((ts) => (
                                <ListItem key={ts.id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1, border: '1px solid #eee' }}>
                                    <ListItemText
                                        primary={ts.Assignment?.Associate?.User?.name || "Usuario"}
                                        secondary={`${new Date(ts.startedAt || ts.started_at).toLocaleDateString()} - ${ts.finishedAt || ts.finished_at ? "Completado" : "En curso"
                                            }`}
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                </CustomTabPanel>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 2 }}>
                {tabValue === 0 && (
                    <Box sx={{ display: "flex", gap: 1, ml: 'auto' }}>
                        <Button onClick={() => setIsEditing(!isEditing)} color="inherit">
                            {isEditing ? t("Cancelar") : t("Editar Tarea")}
                        </Button>
                        {isEditing && (
                            <Button variant="contained" color="primary" onClick={handleSaveTask} disabled={saving}>
                                {saving ? t("Guardando...") : t("Guardar Cambios")}
                            </Button>
                        )}
                    </Box>
                )}
            </DialogActions>
        </Dialog>
    );
}