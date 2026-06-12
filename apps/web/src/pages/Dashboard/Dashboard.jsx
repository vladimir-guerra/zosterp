import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CompanyForm } from "../../components";
import { CompanyCard } from "../../components/Company";

export default function Dashboard() {
  const { t } = useTranslation("web");
  const [companies, setCompanies] = useState([]);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(null);
  const [deleted, setDeleted] = useState(null);

  useEffect(() => {
    if (created) {
      setCompanies([...companies, created]);
      setCreated(null);
      setCreating(false);
    }
  }, [created]);

  useEffect(() => {
    if (deleted) {
      setCompanies((prev) => prev.filter((c) => c.id !== deleted.id));
      setDeleted(null);
    }
  }, [deleted]);

  return (
    <>
      {creating && <CompanyForm setCreated={setCreated} />}
      <header>
        <nav>
          <li>
            <button onClick={() => setCreating(true)}>
              {t("add-company")}
            </button>
          </li>
        </nav>
      </header>
      <main>
        {companies ? (
          <ul>
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                data={company}
                setDeleted={setDeleted}
              />
            ))}
          </ul>
        ) : (
          <p>{t("no-companies")}</p>
        )}
      </main>
    </>
  );
}
