import { insertCompanySchema } from "@repo/schemas";
import { Form, Input } from "../Forms";
import { useTranslation } from "react-i18next";

export default function CompanyForm({ setCreated }) {
  const { t } = useTranslation("web");
  const handleSubmit = (data) => {
    data.id = crypto.randomUUID()
    setCreated(data)
  };
  return (
    <>
      <Form schema={insertCompanySchema} handler={handleSubmit}>
        <h1>{t("create-company")}</h1>
        <Input name={"socialReason"} />
        <Input name={"commercialName"} />
        <Input name={"industry"} />
        <Input name={"country"} />
        <Input name={"email"} />
      </Form>
    </>
  );
}
