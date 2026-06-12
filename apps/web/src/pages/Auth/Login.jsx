import { useForm } from "react-hook-form";
import { Form, Input } from "../../components";
import { loginSchema } from "@repo/schemas";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Login() {
  const { t } = useTranslation("web");
  const handleSubmit = (data) => {};
  return (
    <>
      <Form schema={loginSchema} handler={handleSubmit}>
        <h1>{t("login")}</h1>
        <Input name={"email"} />
        <Input name={"password"} />
        <Link to={"/auth/password"}>{t("recover-password")}</Link>
        <Link to={"/auth/register"}>{t("user-register")}</Link>
      </Form>
    </>
  );
}
