import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import css from "./Input.module.css";

interface InputProps {
  name: string;
  type?: "password" | "email" | "tel" | "number" | "text";
  maxLength?: number;
  minLength?: number;
}

export default function Input({
  name,
  type = "text",
  maxLength,
  minLength,
}: InputProps) {
  const lowerName = name.toLowerCase();
  const finalType = lowerName.includes("password")
    ? "password"
    : lowerName.includes("email")
      ? "email"
      : type;
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <div className={css.inputGroup}>
      <label htmlFor={name} className={css.label}>
        {t(name)}
      </label>
      <input
        id={name}
        type={finalType}
        maxLength={maxLength}
        minLength={minLength}
        className={`${css.input} ${errorMessage ? css.inputError : ""}`}
        {...register(name)}
      />
      {errorMessage && (
        <span className={css.errorMessage}>{t(errorMessage)}</span>
      )}
    </div>
  );
}
