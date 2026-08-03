import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Tabs, Tab, Paper } from "@mui/material";

export default function CompanyLayout() {
  const { id } = useParams();
  const { t } = useTranslation("web");
  const location = useLocation();

  // Definimos las rutas base para usarlas como 'value' en los Tabs
  const routes = {
    dashboard: `/erp/${id}`,
    tasks: `/erp/${id}/tasks`,
    associates: `/erp/${id}/associates`,
    timesheets: `/erp/${id}/timesheets`,
    transactions: `/erp/${id}/transactions`,
  };

  // Ordenamos las rutas de más larga a más corta para evaluar las más específicas primero
  const currentTab = Object.values(routes)
    .sort((a, b) => b.length - a.length)
    .find(route =>
      location.pathname === route || location.pathname.startsWith(`${route}/`)
    ) || routes.dashboard;
    
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box component="header">
        <Paper elevation={1} sx={{ borderRadius: 0 }}>
          <Tabs
            value={currentTab}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            indicatorColor="primary"
            textColor="primary"
            aria-label="company navigation tabs"
            sx={{
              // Opcional: Pequeños ajustes para que respire mejor el diseño
              px: { xs: 1, sm: 2, md: 3 }
            }}
          >
            <Tab
              label={t("dashboard")}
              value={routes.dashboard}
              component={Link}
              to={routes.dashboard}
            />
            <Tab
              label={t("tasks")}
              value={routes.tasks}
              component={Link}
              to={routes.tasks}
            />
            <Tab
              label={t("associates")}
              value={routes.associates}
              component={Link}
              to={routes.associates}
            />
            <Tab
              label={t("timesheets")}
              value={routes.timesheets}
              component={Link}
              to={routes.timesheets}
            />
            <Tab
              label={t("transactions")}
              value={routes.transactions}
              component={Link}
              to={routes.transactions}
            />
          </Tabs>
        </Paper>
      </Box>

      {/* El contenido principal debajo de las pestañas */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}