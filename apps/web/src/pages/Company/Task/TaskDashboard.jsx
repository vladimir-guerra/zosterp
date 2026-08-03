import { emailSchema } from "@repo/schemas";
import { Form, Input } from "../../../components"; 
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  Button, 
  Grid,
  Card,             
  CardContent,      
  CardActions       
} from "@mui/material";

// --- COMPONENTE: Formulario para Asociar Email ---
function AssociateForm({ setAssociate }) {
  const { t } = useTranslation("web");

  const handleSubmit = (data) => {
    // Lógica para asociar el usuario a la tarea
    setAssociate(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, width: '100%', maxWidth: 400, mx: 'auto', mt: 4, mb: 4 }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
        <Button variant="outlined" onClick={() => setAssociate(false)}>BACK</Button>
      </Box>
      <Form schema={emailSchema} handler={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="h2" color="secondary.main" fontWeight="bold">
            {t("associate", "Asociar Usuario")}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Input name={"email"} label={t("email", "Correo electrónico")} />
        </Box>
        <Button type="submit" variant="outlined" fullWidth sx={{ mt: 4 }}>
          SEND
        </Button>
      </Form>
    </Paper>
  );
}

// --- COMPONENTE PRINCIPAL: Dashboard de Tareas ---
export default function TaskDashboard() {
  const { id, "*": wildcard } = useParams();
  const { t } = useTranslation("web");

  // Almacenamiento local (se reiniciará al navegar si no hay API conectada)
  const [tasks, setTasks] = useState([]);
  const [deletedId, setDeletedId] = useState(null);
  const [associate, setAssociate] = useState(false);

  useEffect(() => {
    if (deletedId) {
      setTasks((prev) => prev.filter((c) => c.id !== deletedId));
      setDeletedId(null);
    }
  }, [deletedId]);

  const currentIds = wildcard ? wildcard.split("/") : [];
  const currentParentId = currentIds.length > 0 ? currentIds[currentIds.length - 1] : null;
  
  const visibleTasks = tasks.filter((task) => {
    if (currentParentId) return task.parentId === currentParentId;
    return !task.parentId; // Muestra solo tareas raíz
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      
      {/* Formulario superpuesto (solo asociar) */}
      {associate && <AssociateForm setAssociate={setAssociate} />}

      {/* Botonera de Navegación */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center' }}>
        <Button 
          component={Link} 
          to="new" 
          variant="contained" 
          color="primary"
        >
          {t("add", "Agregar Tarea")}
        </Button>
        
        {wildcard && !associate && (
          <Button variant="outlined" color="secondary" onClick={() => setAssociate(true)}>
            {t("associate", "Asociar Usuario")}
          </Button>
        )}
      </Box>

      {/* Grilla de Tareas */}
      <Box component="main" sx={{ mt: 2 }}>
        {visibleTasks.length > 0 ? (
          <Grid container spacing={4}>
            {visibleTasks.map((c) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={c.id}>
                <Card 
                  variant="outlined" 
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Link 
                      to={wildcard ? `${wildcard}/${c.id}` : c.id} 
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {c.title}
                      </Typography>
                      {c.description && (
                        <Typography variant="body2" color="text.secondary">
                          {c.description}
                        </Typography>
                      )}
                    </Link>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                    <Button 
                      size="small" 
                      color="primary" 
                      onClick={() => setAssociate(true)}
                    >
                      {t("associate", "Asociar")}
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => setDeletedId(c.id)}
                    >
                      {t("delete", "Eliminar")}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography textAlign="center" color="text.secondary" mt={4}>
            {t("no-tasks", "No hay tareas disponibles.")}
          </Typography>
        )}
      </Box>
    </Box>
  );
}