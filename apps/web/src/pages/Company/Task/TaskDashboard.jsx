import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";
import { useTask } from "../../../providers/TaskProvider";
import { useAssociates } from "../../../providers/AssociatesProvider.jsx";

import TaskCardItem from "./TaskCardItem.jsx";
import TaskDetailDialog from "./TaskDetailDialog.jsx";

export default function TaskDashboard() {
  const navigate = useNavigate();
  const { tasks = [], fetchTasks, isLoading, deleteTask } = useTask();
  const { associates = [], fetchAssociates, canManageTasks } = useAssociates();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: companyId } = useParams();

  const parentId = searchParams.get("parentId");
  const editTaskId = searchParams.get("taskId");

  const [isDialogEditMode, setIsDialogEditMode] = useState(false);

  useEffect(() => {
    if (companyId) {
      fetchTasks(companyId);
      if (associates.length === 0) {
        fetchAssociates();
      }
    }
  }, [companyId, associates.length, fetchTasks, fetchAssociates]);

  const selectedTask = useMemo(() => {
    if (!editTaskId || tasks.length === 0) return null;
    return tasks.find((t) => t.id === editTaskId) || null;
  }, [editTaskId, tasks]);

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (parentId) return task.parentId === parentId;
      return !task.parentId;
    });
  }, [tasks, parentId]);

  const handleEditTask = useCallback((task) => {
    setIsDialogEditMode(false);
    setSearchParams((prevParams) => {
      const nextParams = new URLSearchParams(prevParams);
      nextParams.set("taskId", task.id);
      return nextParams;
    });
  }, [setSearchParams]);

  const handleCloseDialog = useCallback(() => {
    setIsDialogEditMode(false);
    setSearchParams((prevParams) => {
      const nextParams = new URLSearchParams(prevParams);
      nextParams.delete("taskId");
      return nextParams;
    });
  }, [setSearchParams]);

  const handleViewSubtasks = useCallback((task) => {
    navigate(`?parentId=${task.id}`);
  }, [navigate]);

  const handleDeleteTask = useCallback(async (task) => {
    if (!canManageTasks) return;
    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      try {
        await deleteTask(companyId, task.id);
        handleCloseDialog();
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
      }
    }
  }, [companyId, deleteTask, canManageTasks, handleCloseDialog]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4, alignItems: "end" }}>
        {parentId && (
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Volver a la tarea superior
          </Button>
        )}
        {canManageTasks && (
          <Button
            component={Link}
            to={parentId ? `new?parentId=${parentId}` : "new"}
            variant="contained"
            color="primary"
          >
            Agregar Tarea
          </Button>
        )}
      </Box>

      <Box component="main" sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        {isLoading && tasks.length === 0 ? (
          <CircularProgress sx={{ mt: 4 }} />
        ) : visibleTasks.length > 0 ? (
          <Grid container spacing={4} sx={{ width: "100%" }}>
            {visibleTasks.map((task) => (
              <TaskCardItem
                key={task.id}
                task={task}
                canManageTasks={canManageTasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onViewSubtasks={handleViewSubtasks}
              />
            ))}
          </Grid>
        ) : (
          <Typography textAlign="center" color="text.secondary" mt={4}>
            No hay tareas aquí.
          </Typography>
        )}
      </Box>

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          companyId={companyId}
          open={Boolean(selectedTask)}
          defaultEditMode={isDialogEditMode}
          onClose={handleCloseDialog}
          onDelete={handleDeleteTask}
        />
      )}
    </Box>
  );
}