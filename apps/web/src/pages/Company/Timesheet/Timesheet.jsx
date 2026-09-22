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
import AddIcon from "@mui/icons-material/Add";

import { useTaskTracking } from "../../../providers/TaskTrackingProvider.jsx";
import CreateTimesheetModal from "./CreateTimesheet.jsx";
import EditTimesheetModal from "./EditTimesheet.jsx";

export default function Timesheet() {
  const { t } = useTranslation("web");
  const { id: companyId } = useParams();

  const {
    timesheets = [],
    isLoading,
    fetchTimesheets,
    deleteTimesheet
  } = useTaskTracking();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (companyId) fetchTimesheets(companyId);
  }, [companyId, fetchTimesheets]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDuration = (start, end) => {
    if (!end) return "En curso...";
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  };

  const handleOpenEdit = (record) => {
    setSelectedRecord(record);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro de tiempo?")) {
      try {
        await deleteTimesheet({ id }, companyId);
        fetchTimesheets(companyId);
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar el registro");
      }
    }
  };

  const refreshData = () => fetchTimesheets(companyId);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Timesheets
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<GetAppIcon />} disabled={timesheets?.length === 0}>
            Exportar
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
            Registrar Tiempo
          </Button>
        </Box>
      </Box>

      {isLoading && timesheets?.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : timesheets?.length > 0 ? (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell>Tarea</TableCell>
                <TableCell>Responsable</TableCell>
                <TableCell>Inicio</TableCell>
                <TableCell>Fin</TableCell>
                <TableCell align="right">Duración</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timesheets.map((record) => (
                <TableRow key={record.id}>
                  <TableCell sx={{ fontWeight: 'medium' }}>
                    {record.Task?.title || "Tarea desconocida"}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main', fontSize: '0.875rem' }}>
                        {record.Assignment?.Associate?.User?.name?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Typography variant="body2">
                        {record.Assignment?.Associate?.User?.name || "Usuario"} {record.Assignment?.Associate?.User?.lastName || ""}
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
                      <Chip label={"Finalizado"} size="small" color="success" variant="outlined" />
                    ) : (
                      <Chip label={"En ejecución"} size="small" color="primary" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" onClick={() => handleOpenEdit(record)}>
                      Editar
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(record.id)}>
                      Eliminar
                    </Button>
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
            No hay registros de tiempo
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
            Crear el primer registro
          </Button>
        </Paper>
      )}

      <CreateTimesheetModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        companyId={companyId}
        onSuccess={refreshData}
      />

      <EditTimesheetModal
        open={openEdit}
        onClose={() => { setOpenEdit(false); setSelectedRecord(null); }}
        companyId={companyId}
        record={selectedRecord}
        onSuccess={refreshData}
      />
    </Box>
  );
}