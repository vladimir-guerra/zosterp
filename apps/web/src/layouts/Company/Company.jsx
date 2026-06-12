import { Link, Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CompanyLayout() {
  const { id } = useParams();
  const { t } = useTranslation("web");
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to={`/erp/${id}`}>{t("dashboard")}</Link>
            </li>
            <li>
              <Link to={`/erp/${id}/tasks`}>{t("tasks")}</Link>
            </li>
            <li>
              <Link to={`/erp/${id}/associates`}>{t("associates")}</Link>
            </li>
            <li>
              <Link to={`/erp/${id}/timesheets`}>{t("timesheets")}</Link>
            </li>
            <li>
              <Link to={`/erp/${id}/transactions`}>{t("transactions")}</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
