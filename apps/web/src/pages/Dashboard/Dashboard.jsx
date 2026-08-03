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
  Divider,
  Grid
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
        p: { xs: 3, md: 4 },
        borderRadius: 2,
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
        mt: 2
      }}
    >
      <Form schema={companySchema} handler={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" component="h2" color="primary.main" fontWeight="bold">
            {t("Create company")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("Complete the next fields to log the information of your enterprise")}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

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
      setDeletedId(null); 
    }
  }, [deletedId]);

  // Nueva función para actualizar una empresa desde la tarjeta
  const handleUpdateCompany = (updatedCompany) => {
    setCompanies((prev) => 
      prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c))
    );
  };

  return (
    <>
      {(creating && <CompanyForm setCreated={setCreated} />)}
      <header>
        <nav>
          {!creating && (
            <Button onClick={() => setCreating(true)} variant="text" sx={{ m: 3 }}>
              {t("add company")}
            </Button>
          )}
        </nav>
      </header>
      <main>
        {companies.length > 0 ? ( 
          <Grid container spacing={9} sx={{ m: 10 }}>
            {companies.map((c) => (
              <Card 
                key={c.id} 
                id={c.id} 
                setDeleted={setDeletedId} 
                companyData={c} // Pasamos la data de la empresa
                onUpdate={handleUpdateCompany} // Pasamos la función para actualizar
                sx={{ height: '100%'}}
              >
                <Link to={`/erp/${c.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h1>{c.socialReason}</h1>
                  <ul>
                    <li>{c.commercialName}</li>
                    <li>{c.email}</li>
                  </ul>
                </Link>
              </Card>
            ))}
          </Grid>
        ) : (
          <p>{t("no-companies")}</p>
        )}
      </main>
    </>
  );
}