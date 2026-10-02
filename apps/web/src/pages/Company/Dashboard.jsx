import { useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Avatar
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Chart from "chart.js/auto";

import { useAssociates } from "../../providers/AssociatesProvider.jsx";
import { useTask } from "../../providers/TaskProvider.jsx";

export default function Dashboard() {
  const { id: companyId } = useParams();

  const { associates = [], fetchAssociates } = useAssociates();
  const { tasks = [], isLoading: loadingTasks, fetchTasks } = useTask();

  const statusChartRef = useRef(null);
  const statusChartInstance = useRef(null);

  const progressChartRef = useRef(null);
  const progressChartInstance = useRef(null);

  useEffect(() => {
    if (!companyId) return;
    fetchAssociates();
    fetchTasks(companyId);
  }, [companyId, fetchAssociates, fetchTasks]);

  const metrics = useMemo(() => {
    let completedCount = 0;
    let inProgressCount = 0;
    let pendingCount = 0;
    let sumPercent = 0;

    tasks.forEach((task) => {
      const checklist = Array.isArray(task.checklist) ? task.checklist : [];
      const totalItems = checklist.length;
      const doneItems = checklist.filter((i) => i.completed).length;

      const percent =
        totalItems > 0
          ? Math.round((doneItems / totalItems) * 100)
          : task.percentDone || 0;

      sumPercent += percent;

      if (percent === 100) {
        completedCount++;
      } else if (percent > 0) {
        inProgressCount++;
      } else {
        pendingCount++;
      }
    });

    const globalProgress = tasks.length > 0 ? Math.round(sumPercent / tasks.length) : 0;

    return {
      completedCount,
      inProgressCount,
      pendingCount,
      globalProgress
    };
  }, [tasks]);

  useEffect(() => {
    if (statusChartInstance.current) {
      statusChartInstance.current.destroy();
    }

    if (statusChartRef.current) {
      const ctxStatus = statusChartRef.current.getContext("2d");
      const hasData = tasks.length > 0;

      statusChartInstance.current = new Chart(ctxStatus, {
        type: "doughnut",
        data: {
          labels: hasData ? ["Completadas", "En curso", "Pendientes"] : ["Sin tareas"],
          datasets: [
            {
              data: hasData
                ? [metrics.completedCount, metrics.inProgressCount, metrics.pendingCount]
                : [1],
              backgroundColor: hasData ? ["#2e7d32", "#1976d2", "#ed6c02"] : ["#e0e0e0"],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" }
          }
        }
      });
    }

    if (progressChartInstance.current) {
      progressChartInstance.current.destroy();
    }

    if (progressChartRef.current) {
      const ctxProgress = progressChartRef.current.getContext("2d");
      const topTasks = tasks.slice(0, 6);
      const taskLabels = topTasks.map((t) => t.title || "Sin título");
      const taskData = topTasks.map((t) => {
        const list = Array.isArray(t.checklist) ? t.checklist : [];
        if (list.length > 0) {
          return Math.round((list.filter((i) => i.completed).length / list.length) * 100);
        }
        return t.percentDone || 0;
      });

      progressChartInstance.current = new Chart(ctxProgress, {
        type: "bar",
        data: {
          labels: taskLabels.length > 0 ? taskLabels : ["Sin tareas registradas"],
          datasets: [
            {
              label: "Avance (%)",
              data: taskData.length > 0 ? taskData : [0],
              backgroundColor: "#36A2EB",
              borderRadius: 6,
              maxBarThickness: 50
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, max: 100 }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    return () => {
      if (statusChartInstance.current) statusChartInstance.current.destroy();
      if (progressChartInstance.current) progressChartInstance.current.destroy();
    };
  }, [metrics, tasks]);

  const kpiCards = [
    {
      title: "Asociados",
      value: associates?.length || 0,
      icon: <GroupIcon />,
      color: "primary.main"
    },
    {
      title: "Tareas Totales",
      value: tasks?.length || 0,
      icon: <AssignmentIcon />,
      color: "secondary.main"
    },
    {
      title: "Completadas",
      value: metrics.completedCount,
      icon: <TaskAltIcon />,
      color: "success.main"
    },
    {
      title: "Avance Global",
      value: `${metrics.globalProgress}%`,
      icon: <TrendingUpIcon />,
      color: "warning.main"
    }
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" fontWeight="bold" color="primary" align="center" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      {loadingTasks && tasks.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: 3,
              mb: 4
            }}
          >
            {kpiCards.map((card, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: 1.5
                }}
              >
                <Avatar sx={{ bgcolor: card.color, width: 52, height: 52 }}>
                  {card.icon}
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 0.5 }}>
                    {card.value}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 3
            }}
          >
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: 360, display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle1" fontWeight="bold" align="center" sx={{ mb: 2 }}>
                Estado de Tareas
              </Typography>
              <Box sx={{ flex: 1, position: "relative" }}>
                <canvas ref={statusChartRef} />
              </Box>
            </Paper>

            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: 360, display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle1" fontWeight="bold" align="center" sx={{ mb: 2 }}>
                Porcentaje de Avance por Tarea
              </Typography>
              <Box sx={{ flex: 1, position: "relative" }}>
                <canvas ref={progressChartRef} />
              </Box>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
}