import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Textfield from "@mui/material/TextField"
 
export default function Input({ name, type = "text" }) {
  const lowerName = name.toLowerCase();
  const finalType = lowerName.includes("password")
    ? "password"
    : lowerName.includes("email")
      ? "email"
      : type;
  const { t } = useTranslation(["web", "schemas"]);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const errorMessage = error?.message;

  return (
    <div>
      <Textfield 
        label={name}
        variant="outlined"
        id={name}
        type={finalType} 
        {...register(name)} 
        required={true} 
        sx={{
          m: 1,
          mb: 2,
          position: "relative",
          width: "100%"
        }}
      />

      {errorMessage && <span>{t(`schemas:${errorMessage}`)}</span>}
    </div>
  );
}
