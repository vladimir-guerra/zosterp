import { useTranslation } from "react-i18next";
import css from "./NotFound.module.css";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t("NOT_FOUND")}</h1>
    </div>
  );
}
