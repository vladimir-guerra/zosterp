import { useTranslation } from "react-i18next";
import { Link, useParams, Outlet } from "react-router-dom";

export default function Company() {
  const { id } = useParams();
  const { t } = useTranslation();
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to={`/erp/${id}/projects`}>{t("projects")}</Link>
            </li>
            <li>
              <Link to={`/erp/${id}/associates`}>{t("associates")}</Link>
            </li>
            <li>
              <Link to={`/erp/${id}/payments`}>{t("payments")}</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet/>
      </main>
    </>
  );
}
