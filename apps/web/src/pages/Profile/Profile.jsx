import { useTranslation } from "react-i18next"
import { useAuth } from "../../providers/AuthProvider"
import { Button } from "@mui/material"

export default function Profile() {
  const { logout } = useAuth()
  const { t } = useTranslation()
  return (
    <>
      <Button onClick={() => logout()} variant="contained" sx={{width: "1rem"}}>{t("logout")}</Button>
    </>
  )
}
