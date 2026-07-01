import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import Carta from "@mui/material/Card"
import CardContent from '@mui/material/CardContent';
import Grid from "@mui/material/Grid"

export default function Card({ setDeleted, id, children }) {
  const { t } = useTranslation("web");
  return (
    <Grid item sx={12} sm={6} md={4} lg={3}>

      <Carta variant="outlined" md={4}>
        <CardContent sx={{ width: "100%" }}>
          {children}
          <Button variant="contained" sx={{ mt: 3 }} onClick={() => setDeleted(id)}>{t("delete")}</Button>
        </CardContent>
      </Carta>
    </Grid>
  );
}
