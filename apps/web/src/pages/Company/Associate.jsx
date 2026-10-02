import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";

import { useAssociates } from "../../providers/AssociatesProvider.jsx";

const getAssociateRoleName = (associate) =>
  associate?.Role?.name || associate?.User?.Role?.name || "associate";

function InviteAssociateModal({ open, onClose, companyId, inviteAssociate }) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState(null);

  const handleSendInvite = async () => {
    if (!inviteEmail) return;
    setIsInviting(true);
    setInviteError(null);

    try {
      await inviteAssociate(companyId, inviteEmail);
      onClose();
      alert("Invitación enviada exitosamente");
    } catch (error) {
      setInviteError(error.message);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold", position: "relative" }}>
        Invitar Asociado
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Ingresa el correo electrónico de la persona que deseas invitar. Se le enviará un enlace para registrarse en la plataforma.
        </Typography>

        <TextField
          fullWidth
          label="Correo electrónico"
          type="email"
          variant="outlined"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          disabled={isInviting}
          error={Boolean(inviteError)}
          helperText={inviteError}
          autoFocus
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isInviting}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSendInvite}
          disabled={!inviteEmail || isInviting}
        >
          {isInviting ? "Enviando..." : "Enviar Invitación"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Associate() {
  const { id: companyId } = useParams();
  const {
    associates = [],
    isLoading,
    canInviteAssociates,
    canManageAssociates,
    fetchAssociates,
    removeAssociate,
    inviteAssociate,
    updateAssociate
  } = useAssociates();

  const [inviteOpen, setInviteOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("associate");
  const [isSavingRole, setIsSavingRole] = useState(false);

  useEffect(() => {
    if (companyId) {
      fetchAssociates(companyId);
    }
  }, [companyId, fetchAssociates]);

  const handleStartEdit = (associate) => {
    setEditingId(associate.id);
    const currentRole = getAssociateRoleName(associate);
    setSelectedRole(currentRole === "adminTask" ? "adminTask" : "associate");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSelectedRole("associate");
  };

  const handleSaveRole = async (userId) => {
    setIsSavingRole(true);
    try {
      await updateAssociate(companyId, userId, selectedRole);
      setEditingId(null);
    } catch (error) {
      console.error("Error actualizando el rol:", error);
      alert("No se pudo actualizar el rol del asociado");
    } finally {
      setIsSavingRole(false);
    }
  };

  const handleRemove = useCallback(async (email) => {
    if (!email) return;
    if (window.confirm("¿Estás seguro de que deseas eliminar a este asociado?")) {
      try {
        await removeAssociate(email);
      } catch (error) {
        console.error("Error removiendo asociado:", error);
      }
    }
  }, [removeAssociate]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Asociados
        </Typography>
        {canInviteAssociates && (
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setInviteOpen(true)}
          >
            Invitar
          </Button>
        )}
      </Box>

      {isLoading && associates.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : associates.length > 0 ? (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 600 }} aria-label="associates table">
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Rol</TableCell>
                {canManageAssociates && <TableCell align="right">Acciones</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {associates.map((associate) => {
                const isEditingRow = editingId === associate.id;
                const roleName = getAssociateRoleName(associate);
                const isRowOwner = roleName === "owner";

                return (
                  <TableRow key={associate.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                          {associate.User?.name?.charAt(0).toUpperCase() || "U"}
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {associate.User?.name || "Usuario Invitado"} {associate.User?.surname || associate.User?.lastName || ""}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>{associate.User?.email}</TableCell>

                    <TableCell sx={{ minWidth: 200 }}>
                      {isEditingRow && canManageAssociates ? (
                        <FormControl size="small" fullWidth>
                          <Select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            disabled={isSavingRole}
                          >
                            <MenuItem value="associate">Asociado</MenuItem>
                            <MenuItem value="adminTask">Administrador de tareas</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <Chip
                          label={
                            isRowOwner
                              ? "Propietario"
                              : roleName === "adminTask"
                                ? "Administrador de tareas"
                                : "Asociado"
                          }
                          size="small"
                          color={
                            isRowOwner
                              ? "primary"
                              : roleName === "adminTask"
                                ? "secondary"
                                : "default"
                          }
                          variant="outlined"
                        />
                      )}
                    </TableCell>

                    {canManageAssociates && (
                      <TableCell align="right">
                        {!isRowOwner && (
                          isEditingRow ? (
                            <Box sx={{ display: "inline-flex", gap: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleSaveRole(associate.userId || associate.user_id)}
                                disabled={isSavingRole}
                              >
                                {isSavingRole ? "..." : "Guardar"}
                              </Button>
                              <Button
                                size="small"
                                color="inherit"
                                onClick={handleCancelEdit}
                                disabled={isSavingRole}
                              >
                                Cancelar
                              </Button>
                            </Box>
                          ) : (
                            <Box sx={{ display: "inline-flex", gap: 1 }}>
                              <Button size="small" onClick={() => handleStartEdit(associate)}>
                                Editar
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleRemove(associate.User?.email)}
                              >
                                Quitar
                              </Button>
                            </Box>
                          )
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 2, border: "1px dashed", borderColor: "grey.400", bgcolor: "grey.50" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aún no tienes asociados
          </Typography>
          {canInviteAssociates && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Invita a miembros de tu equipo para comenzar a colaborar.
              </Typography>
              <Button variant="outlined" startIcon={<PersonAddIcon />} onClick={() => setInviteOpen(true)}>
                Invitar al primer asociado
              </Button>
            </>
          )}
        </Paper>
      )}

      {inviteOpen && canInviteAssociates && (
        <InviteAssociateModal
          open={inviteOpen}
          onClose={() => setInviteOpen(false)}
          companyId={companyId}
          inviteAssociate={inviteAssociate}
        />
      )}
    </Box>
  );
}