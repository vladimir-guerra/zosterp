import { useTranslation } from "react-i18next";

export default function Card({ setDeleted, id, children }) {
  const { t } = useTranslation("web");
  return (
    <div>
      {children}
      <button onClick={() => setDeleted(id)}>{t("delete")}</button>
    </div>
  );
}
