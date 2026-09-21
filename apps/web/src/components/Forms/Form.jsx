import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@mui/material/Button"

export default function Form({ handler, schema, children }) {
  const navigate = useNavigate();
  const form = useForm({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async (data) => {
    try {
      setLoading(true);
      await handler(data);
      setError(null);
      form.reset();
    } catch (err) {
      setError(err?.response?.data?.code || "api:unknown_error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <Button type="button" variant="outlined" onClick={() => navigate(-1)}
        sx={{ mb: 2 }}>
        Volver
      </Button>
      <form onSubmit={form.handleSubmit(handleSend)}>
        {children}
        <Button type="submit" disabled={loading} variant="outlined" sx={{mt: 2, width: "100%" }}>
          {loading ? "Cargando..." : "Enviar"}
        </Button>
        {error && <span>{error}</span>}
      </form>
    </FormProvider> 
  );
}
