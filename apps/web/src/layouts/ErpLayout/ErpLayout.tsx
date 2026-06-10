import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom";

export default function ErpLayout() {
  const { t } = useTranslation();
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to={"/erp/profile"}>{t("profile")}</Link>
            </li>
            <li><Link to={"/erp"}>{t("companies")}</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
}
