import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Landpage() {
  const { t } = useTranslation("web");
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to={"/auth/login"}>{t("login")}</Link>
            </li>
            <li>
              <Link to={"auth/register"}>{t("register")}</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <p>Landpage</p>
      </main>
      <footer></footer>
    </>
  );
}
