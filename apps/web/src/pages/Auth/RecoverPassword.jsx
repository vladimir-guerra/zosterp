import { useForm } from "react-hook-form";
import { Form, Input } from "../../components";
import { insertUserSchema } from "@repo/schemas";
import { useTranslation } from "react-i18next";

export default function RecoverPassword() {
  const { t } = useTranslation("web");
  const handleSubmit = (data) => {};
  return (
    <>
      <Form schema={insertUserSchema} handler={handleSubmit}>
        <h1>{t("request-password")}</h1>
        <Input name={"password"} />
        <Input name={"confirmPassowrd"}/>
      </Form>
    </>
  );
}
