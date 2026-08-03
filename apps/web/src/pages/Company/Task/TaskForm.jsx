import { insertTaskSchema } from "@repo/schemas";
import { Form, Input } from "../../../components";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Divider, Button } from "@mui/material";

export default function TaskForm() {
  const { "*": wildcard } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("web");
  
  // Limpiamos la ruta por si estás creando una sub-tarea (ej. tasks/123/new)
  const ids = wildcard ? wildcard.split("/").filter(id => id !== "new") : [];
  const parentId = ids.length > 0 ? ids[ids.length - 1] : null;

  const handleSubmit = (data) => {
    if (parentId) data.parentId = parentId; 
    data.id = crypto.randomUUID();
    
    // Aquí iría tu llamada a la API para guardar la tarea en la base de datos
    console.log("Tarea lista para guardar:", data);
    
    // Una vez guardada, devolvemos al usuario al dashboard
    navigate(-1);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          width: '100%',
          maxWidth: 500,
          mt: 4,
          mb: 4
        }}
      >

        <Form schema={insertTaskSchema} handler={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" component="h2" color="primary.main" fontWeight="bold">
              {t("create-task", "Crear Tarea")}
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Input name={"title"} label={t("title", "Título")} />
            <Input name={"description"} label={t("description", "Descripción")} />
            <Input variant="outlined" name={"startedAt"} type="date" label={t("startedAt", "Fecha de inicio")} />
            <Input variant="outlined" name={"approxFinishDate"} type="date" label={t("approxFinishDate", "Fecha de fin aprox.")} />
          </Box>
        </Form>
      </Paper>
    </Box>
  );
}