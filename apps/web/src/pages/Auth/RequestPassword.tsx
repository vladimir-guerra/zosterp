import { insertUserSchema } from "@repo/schemas";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import { Form, Input } from "../../components";
import { useEffect } from "react";

export default function RequestPassword() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate("/erp");
  }, [user, navigate]);
  return (
    <>
      <Form
        title="request-password"
        schema={insertUserSchema}
        Elements={[<Input name="email" />]}
        handler={login}
      />
    </>
  );
}
