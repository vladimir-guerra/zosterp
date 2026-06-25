import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card } from "../../components";
import { companySchema } from "@repo/schemas";
import { Form, Input } from "../../components";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  CardContent,
  CardMedia,
  Paper
} from "@mui/material";

function CompanyForm({ setCreated }) {
  const { t } = useTranslation("web");
  const handleSubmit = (data) => {
    data.id = crypto.randomUUID();
    setCreated(data);
  };
  return (
    <Paper>
      <Form schema={companySchema} handler={handleSubmit}>
        <h1>{t("Create company")}</h1>
        <Input name={"socialReason"} />
        <Input name={"commercialName"} />
        <Input name={"industry"} />
        <Input name={"country"} />
        <Input name={"email"} />
      </Form>
    </Paper>
  );
}

export default function Dashboard() {
  const { t } = useTranslation("web");
  const [companies, setCompanies] = useState([]);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(null);
  const [deletedId, setDeletedId] = useState(null);

  useEffect(() => {
    if (created) {
      setCompanies([...companies, created]);
      setCreated(null);
      setCreating(false);
    }
  }, [created]);

  useEffect(() => {
    if (deletedId) {
      setCompanies((prev) => prev.filter((c) => c.id !== deletedId));
      setDeleted(null);
    }
  }, [deletedId]);

  return (
    <>
      {(creating && <CompanyForm setCreated={setCreated} /> )}
      <header>
        <nav>
          <ul>
            <li>
              {
                !creating && (
                  <button onClick={() => setCreating(true)}>
                    {t("add")}
                  </button>
                )
              }
            </li>
          </ul>
        </nav>
      </header>
      <main>
        {companies ? (
          <ul>
            {companies.map((c) => (
              <li key={c.id}>
                <Card id={c.id} setDeleted={setDeletedId}>
                  <Link to={`/erp/${c.id}`}>
                    <h1>{c.socialReason}</h1>
                    <ul>
                      <li>{c.commercialName}</li>
                      <li>{c.email}</li>
                    </ul>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p>{t("no-companies")}</p>
        )}
      </main>
    </>
  );
}
