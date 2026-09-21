import { createBrowserRouter } from "react-router-dom";
import { ToggleAuth } from "./guardians";
import { ERP } from "./layouts";
import { patch } from "@mui/material";

const lazyElement = (path) => async () => {
  const module = await import(/* @vite-ignore */ path);
  return { Component: module.default };
};

const getElement = (element) =>
  typeof element === "string" ? { lazy: lazyElement(element) } : { element };

const setRoute = ({ path, element, indexElement, lazy, children = [] }) => {
  const route = { path, children };
  if (indexElement) children.push({ index: true, ...getElement(indexElement) });
  if (lazy) route.lazy = lazy;
  else if (element) route.element = element;
  return route;
};

export const routes = createBrowserRouter([
  setRoute({
    path: "/",
    element: <ToggleAuth requireUser={false} />,
    indexElement: "./pages/Landpage",
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
                path: ":token",
                lazy: lazyElement("./pages/Auth/RecoverPassword"),
              },
            ],
          }),
          { path: "2FA/:token", lazy: lazyElement("./pages/Auth/TwoFA") },
        ],
      },
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
              { path: ":taskId?", lazy: lazyElement("./pages/Company/Task/TaskDashboard")},
              { path: "*", lazy: lazyElement("./pages/NotFound/NotFound") },
            ],
          }),
          {
            path: "associates",
            lazy: lazyElement("./pages/Company/Associate"),
          },
          {
            path: "transactions",
            lazy: lazyElement("./pages/Company/Transaction"),
          },
          {
            path: "timesheets",
            lazy: lazyElement("./pages/Company/Timesheet"),
          },
        ],
      }),
      { path: "profile", lazy: lazyElement("./pages/Profile") },
    ],
  }),
  { path: "*", lazy: lazyElement("./pages/NotFound") },
]);
