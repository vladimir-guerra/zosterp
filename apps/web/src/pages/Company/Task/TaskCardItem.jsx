import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomCard from "../../../components/Card/Card.jsx";

export default function TaskCardItem({ task, onEdit, onDelete, onAddSubtask, onViewSubtasks }) {
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
          <ListItemText>{t("Detalle")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => executeAction(onDelete)} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>{t("Eliminar")}</ListItemText>
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
            {t("Contenido")}
          </Button>
        </Box>
      </Box>
    </CustomCard>
  );
}