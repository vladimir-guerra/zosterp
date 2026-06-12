import { useForm } from "react-hook-form";
import { Form, Input } from "../../components";
import { insertUserSchema } from "@repo/schemas";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../providers";

export default function Register() {
  const { login } = useAuth();
  const { t } = useTranslation("web");
  const handleSubmit = (data) => {
    login(data);
  };
  return (
    <>
      <Form schema={insertUserSchema} handler={handleSubmit}>
        <h1>{t("register")}</h1>
        <Input name={"name"} />
        <Input name={"surname"} />
        <Input name={"email"} />
        <Input name={"password"} />
        <Input name={"confirmPassword"} />
        <Link to={"/auth/login"}>{t("login")}</Link>
      </Form>
    </>
  );
}
