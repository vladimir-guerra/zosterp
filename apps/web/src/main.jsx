import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "normalize.css";
import "./index.css";
import { AuthProvider, TaskProvider, CompanyProvider } from "./providers";
import { RouterProvider } from "react-router-dom";
import { routes } from "./RouteManager";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CompanyProvider>
        <TaskProvider>
          <Suspense fallback={<p>...</p>}>
            <RouterProvider router={routes} />
          </Suspense>
        </TaskProvider>
      </CompanyProvider>
    </AuthProvider>
  </StrictMode>,
);
