import { createBrowserRouter, type RouteObject, Outlet } from "react-router-dom";
import { ToogleAuth } from "./guardians";
import { NotFound } from "./pages";
interface EntityRoutesConfig extends Omit<
  RouteObject,
  "children" | "index" | "lazy"
> {
  lazyElement?: () => Promise<{ default: React.ComponentType<any> }>;
  lazyIndexChild?: () => Promise<{ default: React.ComponentType<any> }>;
  children?: RouteObject[];
}

function createRouteObject({
  path,
  element,
  lazyElement,
  lazyIndexChild,
  children = [],
}: EntityRoutesConfig): RouteObject {
  const route: RouteObject = { path };

  if (element) route.element = element;

  if (lazyElement) {
    route.lazy = async () => {
      const { default: Component } = await lazyElement();
      return { Component };
    };
  }

  const childrenRoutes: RouteObject[] = [...children];

  if (lazyIndexChild) {
    childrenRoutes.unshift({
      index: true,
      lazy: async () => {
        const { default: Component } = await lazyIndexChild();
        return { Component };
      },
    });
  }

  if (childrenRoutes.length > 0) route.children = childrenRoutes;
  return route;
}

export const routes = createBrowserRouter([
  createRouteObject({
    path: "/",
    element: <ToogleAuth requireAuth={false} />,
    lazyIndexChild: () => import("./pages/Landpage"),
    children: [
      createRouteObject({
        path: "auth/login",
        lazyElement: () => import("./pages/Auth/Login"),
      }),
      createRouteObject({
        path: "auth/register",
        lazyElement: () => import("./pages/Auth/Register"),
      }),
      createRouteObject({
        path: "auth/reset-password",
        lazyElement: () => import("./pages/Auth/ResetPassword"),
      }),
      createRouteObject({
        path: "auth/request-password",
        lazyElement: () => import("./pages/Auth/RequestPassword"),
      }),
      createRouteObject({
        path: "auth/2FA",
        lazyElement: () => import("./pages/Auth/TwoFA"),
      }),
    ],
  }),
  createRouteObject({
    path: "/erp",
    element: <ToogleAuth requireAuth={true} />,
    lazyIndexChild: () => import("./pages/Company/Company"),
    children: [
      createRouteObject({
        path: ":id",
        lazyElement: () => import("./layouts/Company"),
        lazyIndexChild: () => import("./pages/Company/CompanyDashboard"),
        children: [
          createRouteObject({
            path: "associates",
            lazyElement: () => import("./pages/Company/Associate"),
          }),
          createRouteObject({
            path: "payments",
          }),
          createRouteObject({
            path: "projects",
            lazyElement: () => import("./pages/Project/Project"),
          }),
          createRouteObject({
            path: "projects/:id",
            //lazyElement: () => import("./guardians/ProjectGuardian")
            lazyIndexChild: () => import("./pages/Project/ProjectDashboard"),
            children: [
              createRouteObject({
                path: "tasks",
                lazyElement: () => import("./pages/Project/Task"),
              }),
              createRouteObject({
                path: "members",
                lazyElement: () => import("./pages/Project/Member"),
              }),
            ],
          }),
        ],
      }),
      createRouteObject({
        path: "profile",
        lazyElement: () => import("./pages/Profile"),
      }),
    ],
  }),
  { path: "*", element: <NotFound /> },
]);
