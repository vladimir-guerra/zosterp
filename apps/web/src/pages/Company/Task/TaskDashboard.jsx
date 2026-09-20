import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";
import { useTask } from "../../../providers/TaskProvider";

import TaskCardItem from "./TaskCardItem.jsx"; 
import TaskDetailDialog from "./TaskDetailDialog.jsx";

export default function TaskDashboard() {
  const { t } = useTranslation("web");
  const navigate = useNavigate();
  const { tasks, fetchTasks, isLoading, deleteTask } = useTask();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: companyId } = useParams();
  
  const parentId = searchParams.get("parentId");
  const editTaskId = searchParams.get("taskId");
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDialogEditMode, setIsDialogEditMode] = useState(false);

  useEffect(() => {
    if (companyId) {
      fetchTasks(companyId);
    }
  }, [companyId, fetchTasks]);

  useEffect(() => {
    if (editTaskId && tasks.length > 0) {
      const taskFound = tasks.find(t => t.id === editTaskId);
      if (taskFound) {
        setSelectedTask(taskFound);
        setIsDialogEditMode(false);
      } else if (!editTaskId) {
        setSelectedTask(null);
      }
    }
  }, [editTaskId, tasks]);

  const visibleTasks = tasks.filter((task) => {
    if (parentId) return task.parentId === parentId;
    return !task.parentId;
  });

  const handleEditTask = (task) => {
    setIsDialogEditMode(false);
    setSearchParams((prevParams) => {
      prevParams.set("taskId", task.id);
      return prevParams;
    });
  };

  const handleCloseDialog = () => {
    setIsDialogEditMode(false);
    setSelectedTask(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("taskId");
    setSearchParams(newParams);
  };

  const handleAddSubtask = (task) => navigate(`new?parentId=${task.id}`);
  
  const handleViewSubtasks = (task) => navigate(`?parentId=${task.id}`);

  const handleDeleteTask = async (task) => {
    if (window.confirm(t("¿Estás seguro de que deseas eliminar esta tarea?"))) {
      try {
        await deleteTask(companyId, task.id);
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
      }
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, alignItems: 'center' }}>
        {parentId && (
          <Button variant="outlined" onClick={() => navigate(-1)}>
            {t("Volver a la tarea superior")}
          </Button>
        )}
        <Button
          component={Link}
          to={parentId ? `new?parentId=${parentId}` : "new"}
          variant="contained"
          color="primary"
        >
          {t("Agregar Tarea")}
        </Button>
      </Box>

      <Box component="main" sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        {isLoading ? (
          <CircularProgress sx={{ mt: 4 }} />
        ) : visibleTasks.length > 0 ? (
          <Grid container spacing={4} sx={{ width: '100%' }}>
            {visibleTasks.map((task) => (
              <TaskCardItem
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onAddSubtask={handleAddSubtask}
                onDelete={handleDeleteTask}
                onViewSubtasks={handleViewSubtasks}
              />
            ))}
          </Grid>
        ) : (
          <Typography textAlign="center" color="text.secondary" mt={4}>
            {t("No hay tareas aquí.")}
          </Typography>
        )}
      </Box>

      <TaskDetailDialog
        task={selectedTask}
        companyId={companyId}
        open={Boolean(selectedTask)}
        defaultEditMode={isDialogEditMode}
        onClose={handleCloseDialog}
      />
    </Box>
  );
}