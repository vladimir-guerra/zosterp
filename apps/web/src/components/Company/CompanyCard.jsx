import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function CompanyCard({ data, setDeleted }) {
  const { t } = useTranslation("web");
  const handleDelete = () => {
    setDeleted(data);
  };
  return (
    <div>
      <Link to={`/erp/${data.id}`}>
        <ul>
          <li>
            <h1>{data.socialReason}</h1>
          </li>
          <li>
            <h2>{data.commercialName}</h2>
          </li>
          <li>{data.email}</li>
        </ul>
      </Link>
      <button onClick={handleDelete}>{t("delete-company")}</button>
    </div>
  );
}
