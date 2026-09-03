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
import { useCompany } from "../../providers/CompanyProvider"; 

export default function Card({ id, children, companyData }) {
  const { t } = useTranslation("web");

  const { updateCompany, deleteCompany } = useCompany();

  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(companyData || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleOpen = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setIsEditing(false);
    setFormData(companyData);
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleDelete = async () => {
    try {
      await deleteCompany(id); 
      handleClose();
    } catch (error) {
      console.error("Error al eliminar la empresa:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateCompany(id, formData); 
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar la empresa:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Carta
        variant="outlined"
        sx={{
          padding: 1,
          position: "relative",
          height: "100%",
          borderRadius: 3,
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: 1
          }
        }}
      >
        <IconButton
          size="small"
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
          onClick={handleOpen}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>

        <CardContent sx={{ width: "100%", pt: 3, pb: "16px !important" }}>
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
              disabled={!isEditing || isSaving}
              fullWidth
            />
            <TextField
              label={t("Commercial Name", "Nombre Comercial")}
              name="commercialName"
              value={formData.commercialName || ""}
              onChange={handleChange}
              disabled={!isEditing || isSaving}
              fullWidth
            />
            <TextField
              label={t("Industry", "Industria")}
              name="type"
              value={formData.type || ""}
              onChange={handleChange}
              disabled={!isEditing || isSaving}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button color="error" variant="outlined" onClick={handleDelete} disabled={isSaving}>
            {t("delete", "Eliminar")}
          </Button>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={handleEditToggle} color="inherit" disabled={isSaving}>
              {isEditing ? t("cancel", "Cancelar") : t("edit", "Editar")}
            </Button>

            {isEditing && (
              <Button variant="contained" color="primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? t("saving", "Guardando...") : t("save", "Guardar")}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}