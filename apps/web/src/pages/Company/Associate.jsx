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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from '@mui/icons-material/Close';

import { useAssociates } from "../../providers/AssociatesProvider.jsx";

export default function Associate() {
  const { t } = useTranslation("web");
  const { id: companyId } = useParams();

  const { associates, isLoading, fetchAssociates, removeAssociate, inviteAssociate } = useAssociates();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState(null);

  useEffect(() => {
    if (companyId) {
      fetchAssociates();
    }
  }, [companyId, fetchAssociates]);

  const handleRemove = async (email) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar a este asociado?")) {
      try {
        await removeAssociate(email);
      } catch (error) {
        console.error("Error removiendo asociado:", error);
      }
    }
  };

  const handleOpenInvite = () => {
    setInviteError(null);
    setInviteEmail("");
    setInviteOpen(true);
  };

  const handleSendInvite = async () => {
    if (!inviteEmail) return;
    setIsInviting(true);
    setInviteError(null);

    try {
      await inviteAssociate(companyId, inviteEmail);
      setInviteOpen(false);
      alert("Invitación enviada exitosamente");
    } catch (error) {
      setInviteError(error.message);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Asociados
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenInvite}
        >
          Invitar
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : associates?.length > 0 ? (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 600 }} aria-label="associates table">
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {associates.map((associate) => (
                <TableRow key={associate.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {associate.User?.name?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {associate.User?.name || "Usuario Invitado"} {associate.User?.surname || ""}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{associate.User?.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={associate.Role?.name === 'adminTask' ? 'Administrador' : 'Asociado'}
                      size="small"
                      color={associate.Role?.name === 'adminTask' ? 'secondary' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" color="error" onClick={() => handleRemove(associate.User.email)}>
                      Quitar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 2, border: '1px dashed', borderColor: 'grey.400', bgcolor: 'grey.50' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aún no tienes asociados
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Invita a miembros de tu equipo para comenzar a colaborar.
          </Typography>
          <Button variant="outlined" startIcon={<PersonAddIcon />} onClick={handleOpenInvite}>
            Invitar al primer asociado
          </Button>
        </Paper>
      )}

      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: "bold", position: "relative" }}>
          Invitar Asociado
          <IconButton
            onClick={() => setInviteOpen(false)}
            size="small"
            sx={{ position: 'absolute', right: 8, top: 8 }}
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
            label={"Correo electrónico"}
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
          <Button onClick={() => setInviteOpen(false)} color="inherit" disabled={isInviting}>
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
    </Box>
  );
}