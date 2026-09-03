import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card } from "../../components";
import { companySchema } from "@repo/schemas";
import { Form, Input } from "../../components";
import {
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  Grid,
  CircularProgress,
  AppBar,
  Toolbar,
  Avatar,
  Chip,
  Stack
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutlined";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useCompany } from "../../providers/CompanyProvider";

function CompanyForm({ onClose }) {
  const { t } = useTranslation("web");
  const { createCompany, isLoading } = useCompany();

  const handleSubmit = async (data) => {
    try {
      await createCompany(data);
      onClose();
    } catch (error) {
      console.error("Error al crear la empresa:", error);
    }
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
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" component="h2" color="primary.main" fontWeight="bold">
            {t("Create company")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("Complete the next fields to log the information of your enterprise")}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Form schema={companySchema} handler={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Input name={"socialReason"} label={t("Social Reason")} />
          <Input name={"commercialName"} label={t("Commercial Name")} />
          <Input name={"type"} label={t("Industry")} />
        </Box>
      </Form>
    </Paper>
  );
}

export default function Dashboard() {
  const { t } = useTranslation("web");
  const [creating, setCreating] = useState(false);

  const {
    companies,
    fetchCompanies,
    isLoading,
    updateCompany,
    deleteCompany
  } = useCompany();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleUpdateCompany = async (updatedCompany) => {
    await updateCompany(updatedCompany.id, updatedCompany);
  };

  return (
    <>
      {creating && <CompanyForm onClose={() => setCreating(false)} />}

      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar component="nav" sx={{ justifyContent: 'start' }}>
          {!creating && (
            <Button onClick={() => setCreating(true)} variant="text" sx={{ m: 3 }}>
              {t("add company")}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main">
        {isLoading && companies.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : companies.length > 0 ? (
          <Grid container spacing={9} sx={{ m: 10 }}>
            {companies.map((c) => (
              <Card
                key={c.id}
                id={c.id}
                setDeleted={() => deleteCompany(c.id)}
                companyData={c}
                onUpdate={handleUpdateCompany}
                sx={{ height: '100%' }}
              >
                <Link to={`/erp/${c.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 44,
                          height: 44,
                          fontWeight: 'bold'
                        }}
                      >
                        {c.socialReason?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          component="h1"
                          fontWeight="bold"
                          noWrap
                        >
                          {c.socialReason}
                        </Typography>
                        {c.commercialName && (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {c.commercialName}
                          </Typography>
                        )}
                      </Box>
                    </Stack>

                    {c.type && (
                      <Chip
                        icon={<ApartmentIcon />}
                        label={c.type}
                        size="small"
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start' }}
                      />
                    )}

                    {c.email && (
                      <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                        <MailOutlineIcon fontSize="small" />
                        <Typography variant="body2" noWrap>
                          {c.email}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Link>
              </Card>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ m: 10 }}>
            {t("no-companies")}
          </Typography>
        )}
      </Box>
    </>
  );
}