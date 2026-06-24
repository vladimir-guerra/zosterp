import { useTranslation } from "react-i18next"
import { useAuth } from "../../providers/AuthProvider"


export default function Profile() {
  const { logout } = useAuth()
  const { t } = useTranslation()
  return (
    <>
      <button onClick={() => logout()}>{t("logout")}</button>
    </>
  )
}
