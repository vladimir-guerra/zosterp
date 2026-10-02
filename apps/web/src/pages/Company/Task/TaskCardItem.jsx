import { memo } from "react";
import {
  Box,
  Typography,
  LinearProgress
} from "@mui/material";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CustomCard from "../../../components/Card/Card.jsx";

const TaskCardItem = memo(function TaskCardItem({ task, onEdit }) {
  const checklist = Array.isArray(task.checklist) ? task.checklist : [];
  const totalItems = checklist.length;
  const completedItems = checklist.filter((item) => item.completed).length;
  const progress =
    totalItems > 0
      ? Math.round((completedItems / totalItems) * 100)
      : task.percentDone || 0;

  return (
    <CustomCard
      id={task.id}
      onClick={() => onEdit(task)}
    >
      <Box
        sx={{
          flexGrow: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary" noWrap>
            {task.title}
          </Typography>
          {task.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {task.description}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: "auto", pt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: progress === 100 ? "success.main" : "text.secondary"
              }}
            >
              <CheckBoxOutlinedIcon sx={{ fontSize: "1rem" }} />
              <Typography variant="caption" fontWeight="bold">
                {totalItems > 0 ? `${completedItems}/${totalItems} ítems` : "Progreso"}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              fontWeight="bold"
              color={progress === 100 ? "success.main" : "primary"}
            >
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={progress === 100 ? "success" : "primary"}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      </Box>
    </CustomCard>
  );
});

export default TaskCardItem;