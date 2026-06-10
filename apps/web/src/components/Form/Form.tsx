import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState, type ReactNode } from "react";

interface FormProps {
  title: string;
  Elements: ReactNode[];
  handler: (data: any) => void;
  schema: any;
}

export default function Form({ handler, schema, title, Elements }: FormProps) {
  const navigate = useNavigate();
  const form = useForm({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>();
  const { t } = useTranslation();
  const handleSend = async (data: any) => {
    try {
      setLoading(true);
      await handler(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("ERROR");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <FormProvider {...form}>
        <div>
          <button onClick={() => navigate(-1)}>{t("back")}</button>
          <form onSubmit={form.handleSubmit(handleSend)}>
            <h1>{t(title)}</h1>
            {Elements.map((element) => element)}
            <input type="submit" value={t("send")} disabled={loading} />
            {error && <span>{t(error)}</span>}
          </form>
        </div>
      </FormProvider>
    </div>
  );
}
