import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input } from "../../components";
import { useAuth } from "../../providers";
import { twoFASchema } from "@repo/schemas"
import { Alert } from "@mui/material";

export default function TwoFA() {
  const { token } = useParams();
  const { TFA, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await TFA(data.code, token);
    if(isAuthenticated) navigate("/erp")
  };

  return (
    <>
      <Form schema={twoFASchema} handler={handleSubmit}>
        <h1>Verificación 2FA</h1>
        {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
        <Input name="code" placeholder="Ingresa el código de 6 dígitos" />
      </Form>
    </>
  );
}