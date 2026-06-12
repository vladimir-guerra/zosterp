import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ERP() {
  const navigate = useNavigate()
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
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}
