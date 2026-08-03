import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Button, 
  Card as Carta, 
  CardContent, 
  Grid, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Card({ setDeleted, id, children, companyData, onUpdate }) {
  const { t } = useTranslation("web");
  
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(companyData || {});

  // Prevenir que el click en los 3 puntos active el <Link> (si los estilos se solapan)
  const handleOpen = (e) => {
    e.stopPropagation(); 
    e.preventDefault();
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setIsEditing(false);
    setFormData(companyData); // Revertir cambios si cierra sin guardar
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleDelete = () => {
    setDeleted(id);
    handleClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(formData); // Actualiza el estado en el Dashboard
    }
    setIsEditing(false);
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Carta variant="outlined" sx={{ position: "relative", height: "100%" }}>
        
        {/* Botón de 3 puntitos */}
        <IconButton 
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }} 
          onClick={handleOpen}
        >
          <MoreVertIcon />
        </IconButton>

        <CardContent sx={{ width: "100%", pt: 4 }}>
          {children}
        </CardContent>
      </Carta>

      <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {t("Company Properties", "Propiedades de la Empresa")}
        </DialogTitle>
        
        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t("Social Reason", "Razón Social")}
              name="socialReason"
              value={formData.socialReason || ""}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
            />
            <TextField
              label={t("Commercial Name", "Nombre Comercial")}
              name="commercialName"
              value={formData.commercialName || ""}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
            />
            <TextField
              label={t("Industry", "Industria")}
              name="industry"
              value={formData.industry || ""}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
            />
            <TextField
              label={t("Country", "País")}
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
            />
            <TextField
              label={t("Email", "Correo")}
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
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
              <Button variant="contained" color="primary" onClick={handleSave}>
                {t("save", "Guardar")}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}