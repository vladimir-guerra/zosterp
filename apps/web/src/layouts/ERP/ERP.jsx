import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box"

export default function ERP() {
  const { t } = useTranslation("web");
  return (
    <>
      <header>
        <nav>
          <ul>

            <li>
              <Link to={"/erp/profile"}>{t("profile")}</Link>
            </li>
            <li>
              <Link to={"/erp"}>{t("companies")}</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            bgcolor: "grey.50",
          }}>
          <Outlet />
        </Box>
      </main>
      <footer>

      </footer>
    </>
  );
}
