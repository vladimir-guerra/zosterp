import { insertUserSchema } from "@repo/schemas";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import { Form, Input } from "../../components";
import { useEffect } from "react";

export default function ResetPassword() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate("/erp");
  }, [user, navigate]);
  return (
    <>
      <Form
        title="reset-password"
        schema={insertUserSchema}
        Elements={[
          <Input name="password" minLength={8} />,
          <Input name="confirmPassword" minLength={8} />,
        ]}
        handler={login}
      />
    </>
  );
}
