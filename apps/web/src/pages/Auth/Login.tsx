import { loginSchema } from "@repo/schemas";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input } from "../../components";
import { useEffect } from "react";

export default function Login() {
  const { t } = useTranslation();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate("/erp");
  }, [user, navigate]);
  return (
    <>
      <Form
        title="login"
        schema={loginSchema}
        Elements={[
          <Input name="email" />,
          <Input name="password" minLength={8} />,
          <Link to={"/auth/register"}>{t("register")}</Link>,
          <Link to={"/auth/request-password"}>{t("request-password")}</Link>,
        ]}
        handler={login}
      />
    </>
  );
}
