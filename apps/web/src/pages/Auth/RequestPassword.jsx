import { useForm } from "react-hook-form";
import { Form, Input } from "../../components";
import { insertUserSchema } from "@repo/schemas";
import { useTranslation } from "react-i18next";

export default function RequestPassword() {
  const { t } = useTranslation("web");
  const handleSubmit = (data) => {};
  return (
    <>
      <Form schema={insertUserSchema} handler={handleSubmit}>
        <h1>{t("request-password")}</h1>
        <Input name={"email"} />
      </Form>
    </>
  );
}
