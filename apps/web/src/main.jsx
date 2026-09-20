import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider, TaskProvider, CompanyProvider, AssociatesProvider, TaskTrackingProvider } from "./providers";
import { RouterProvider } from "react-router-dom";
import { routes } from "./RouteManager";
import i18n from "i18next";
import "./i18n";
import "normalize.css";

i18n.on("initialized", () => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <AuthProvider>
        <CompanyProvider>
          <TaskProvider>
            <AssociatesProvider>
              <TaskTrackingProvider>
                <Suspense fallback={<p>...</p>}>
                  <RouterProvider router={routes} />
                </Suspense>
              </TaskTrackingProvider>
            </AssociatesProvider>
          </TaskProvider>
        </CompanyProvider>
      </AuthProvider>
    </StrictMode>,
  );
});
