import { useForm } from "react-hook-form";
import { Form, Input } from "../../components";
import { insertUserSchema } from "@repo/schemas";
import { useTranslation } from "react-i18next";

export default function TwoFA() {
  const { t } = useTranslation("web");
  const handleSubmit = (data) => {};
  return (
    <>
      <Form schema={insertUserSchema} handler={handleSubmit}>
        <h1>{t("twofa")}</h1>
        <Input name={"code"} />
      </Form>
    </>
  );
}
