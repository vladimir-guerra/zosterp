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
  Paper,
  Divider
} from "@mui/material";

function CompanyForm({ setCreated }) {
  const { t } = useTranslation("web");
  const handleSubmit = (data) => {
    data.id = crypto.randomUUID();
    setCreated(data);
  };
  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 3, md: 4 }, // Padding adaptable: 3 en móviles, 4 en pantallas más grandes
        borderRadius: 2,
        width: '100%',
        maxWidth: 500, // Evita que el formulario se estire demasiado en pantallas gigantes
        mx: 'auto', // Lo centra horizontalmente si está en un contenedor amplio
        mt: 2
      }}
    >
      <Form schema={companySchema} handler={handleSubmit}>

        {/* Encabezado del Formulario */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" component="h2" color="primary.main" fontWeight="bold">
            {t("Create company")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Ingresa los datos correspondientes para registrar una nueva empresa.
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Contenedor de Inputs */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Input name={"socialReason"} label={t("Social Reason")} />
          <Input name={"commercialName"} label={t("Commercial Name")} />
          <Input name={"industry"} label={t("Industry")} />
          <Input name={"country"} label={t("Country")} />
          <Input name={"email"} label={t("Email")} />
        </Box>
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
      {(creating && <CompanyForm setCreated={setCreated} />)}
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
