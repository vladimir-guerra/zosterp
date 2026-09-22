import { createBrowserRouter } from "react-router-dom";
import { ToggleAuth } from "./guardians";
import { ERP } from "./layouts";
import { Box, CircularProgress } from '@mui/material';

const LoadContent = () => (<Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}> <CircularProgress /> </Box>);

const lazyElement = (path) => async () => {
  const module = await import(path);
  return { Component: module.default };
};

const getElement = (element) =>
  typeof element === "string" ? { lazy: lazyElement(element) } : { element };

const setRoute = ({ path, element, indexElement, lazy, children = [], hydrateFallbackElement }) => {
  const route = { path, children };
  if (indexElement) children.push({ index: true, ...getElement(indexElement) });
  if (lazy) route.lazy = lazy;
  else if (element) route.element = element;

  if (hydrateFallbackElement) route.hydrateFallbackElement = hydrateFallbackElement;
  return route;
};

export const routes = createBrowserRouter([
  setRoute({
    path: "/",
    element: <ToggleAuth requireUser={false} />,
    indexElement: "./pages/Landpage",
    hydrateFallbackElement: <LoadContent />,
    children: [
      {
        path: "auth",
        children: [
          { path: "login", lazy: lazyElement("./pages/Auth/Login") },
          { path: "register", lazy: lazyElement("./pages/Auth/Register") },
          setRoute({
            path: "password",
            indexElement: "./pages/Auth/RequestPassword",
            children: [
              {
                path: "recover",
                lazy: lazyElement("./pages/Auth/RecoverPassword"),
              },
            ],
          }),
          { path: "2FA", lazy: lazyElement("./pages/Auth/TwoFA") },
        ],
      },
      { path: "workerInvitation/:companyId", lazy: lazyElement("./pages/Auth/WorkerInvitation") },
    ],
  }),
  setRoute({
    path: "/erp",
    element: (
      <ToggleAuth requireUser={true}>
        <ERP />
      </ToggleAuth>
    ),
    indexElement: "./pages/Dashboard",
    children: [
      setRoute({
        path: ":id",
        lazy: lazyElement("./layouts/Company"),
        indexElement: "./pages/Company/Dashboard",
        children: [
          setRoute({
            path: "tasks",
            indexElement: "./pages/Company/Task/TaskDashboard",
            children: [
              { path: "new", lazy: lazyElement("./pages/Company/Task/TaskForm") },
              { path: ":taskId?", lazyElement: lazyElement("./pages/Company/Task/TaskDashboard") },
              { path: "*", lazy: lazyElement("./pages/NotFound/NotFound") },
            ],
          }),
          {
            path: "associates",
            lazy: lazyElement("./pages/Company/Associate"),
          },
          {
            path: "timesheets",
            lazy: lazyElement("./pages/Company/Timesheet/Timesheet"),
          },
        ],
      }),
      { path: "profile", lazy: lazyElement("./pages/Profile") },
    ],
  }),
  { path: "*", lazy: lazyElement("./pages/NotFound") },
]);
