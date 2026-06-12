import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
      <label htmlFor={name}>{t(`web:${name}`)}</label>
      <input
        id={name}
        type={finalType}
        {...register(name)}
      />
      {errorMessage && <span>{t(`schemas:${errorMessage}`)}</span>}
    </div>
  );
}
