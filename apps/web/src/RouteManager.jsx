import { createBrowserRouter } from "react-router-dom";
import { ToggleAuth } from "./guardians";
import { ERP } from "./layouts";

const lazyElement = (path) => async () => {
  const module = await import(path);
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
                path: "recover",
                lazy: lazyElement("./pages/Auth/RecoverPassword"),
              },
            ],
          }),
          { path: "2FA", lazy: lazyElement("./pages/Auth/TwoFA") },
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
            indexElement: "./pages/Company/Task",
            children: [
              { path: "*", lazy: lazyElement("./pages/Company/Task") },
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
