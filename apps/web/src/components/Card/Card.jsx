import { useState, useRef } from "react";
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
  Box,
  Typography
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useCompany } from "../../providers/CompanyProvider";

export default function Card({ id, children, companyData, onMenuClick, onClick }) {
  const { updateCompany, deleteCompany } = useCompany();
  const contentRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(companyData || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleOpen = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (onMenuClick) {
      onMenuClick(e);
    } else {
      setOpenModal(true);
    }
  };

  const handleCardClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (contentRef.current && !contentRef.current.contains(e.target)) {
      const clickableChild = contentRef.current.querySelector("a, button, [role='button']") || contentRef.current.firstElementChild;
      clickableChild?.click();
    }
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
        onClick={handleCardClick}
        sx={{
          position: "relative",
          width: "100%",
          minWidth: 240,
          height: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: 3,
          cursor: "pointer",
          userSelect: "none", 
          transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: 3,
            transform: "translateY(-2px)",
            "& .action-text": {
              color: "primary.main",
            },
            "& .action-arrow": {
              transform: "translateX(4px)",
              color: "primary.main",
            }
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

        <CardContent 
          ref={contentRef}
          sx={{ 
            pt: 3, 
            px: 2.5,
            pb: 1, 
            flex: 1,
            minHeight: 0,
            overflow: "hidden" 
          }}
        >
          {children}
        </CardContent>

        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "flex-end", 
            px: 2.5,
            py: 1.5,
            bgcolor: "grey.50",
            borderTop: "1px solid",
            borderColor: "divider",
            flexShrink: 0
          }}
        >
          <Typography 
            className="action-text"
            variant="caption" 
            fontWeight="bold" 
            color="text.secondary"
            sx={{ transition: "color 0.2s ease", mr: 0.5 }}
          >
            Click para ingresar
          </Typography>
          <ArrowForwardIcon 
            className="action-arrow"
            sx={{ color: "text.secondary", fontSize: "0.95rem", transition: "transform 0.2s ease, color 0.2s ease" }} 
          />
        </Box>
      </Carta>

      <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Propiedades de la Empresa
        </DialogTitle>

        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Razón Social"
              name="socialReason"
              value={formData.socialReason || ""}
              onChange={handleChange}
              disabled={!isEditing || isSaving}
              fullWidth
            />
            <TextField
              label="Nombre Comercial"
              name="commercialName"
              value={formData.commercialName || ""}
              onChange={handleChange}
              disabled={!isEditing || isSaving}
              fullWidth
            />
            <TextField
              label="Industria"
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
            Eliminar
          </Button>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={handleEditToggle} color="inherit" disabled={isSaving}>
              {isEditing ? "Cancelar" : "Editar"}
            </Button>

            {isEditing && (
              <Button variant="contained" color="primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}