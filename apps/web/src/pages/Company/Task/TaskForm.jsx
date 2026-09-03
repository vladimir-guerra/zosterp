import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Box, Paper, Typography, Divider, Button } from "@mui/material";
import { insertTaskSchema } from "@repo/schemas";
import { Form, Input } from "../../../components";
import { useTask } from "../../../providers/TaskProvider";

export default function TaskForm() {
  const { t } = useTranslation("web");
  const navigate = useNavigate();
  const { id: companyId } = useParams();
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get("parentId");
  const { createTask } = useTask();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        companyId: companyId,
        parentId: parentId || null
      };
      await createTask(payload);
      navigate(parentId ? `..?parentId=${parentId}` : "..");
    } catch (error) {
      console.error("Error al crear la tarea:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 2 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, width: '100%', maxWidth: 500, mt: 4 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2" color="primary.main" fontWeight="bold">
            {parentId ? t("create-subtask", "Crear Subtarea") : t("create-task", "Crear Tarea")}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Form schema={insertTaskSchema} handler={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Input name={"title"} label={t("title", "Título")} />
            <Input name={"description"} label={t("description", "Descripción")} />
            <Input variant="outlined" name={"startedAt"} type="date" label={t("startedAt", "Fecha de inicio")} />
            <Input variant="outlined" name={"approximateFinishDate"} type="date" label={t("approximateFinishDate", "Fecha de fin aprox.")} />
          </Box>
        </Form>
      </Paper>
    </Box>
  );
}