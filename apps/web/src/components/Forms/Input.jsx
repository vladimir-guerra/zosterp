import { useFormContext } from "react-hook-form";
import Textfield from "@mui/material/TextField"
import { Alert } from "@mui/material";
 
export default function Input({ name, type = "text" }) {
  const lowerName = name.toLowerCase();
  const finalType = lowerName.includes("password")
    ? "password"
    : lowerName.includes("email")
      ? "email"
      : type;
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

      {errorMessage && <Alert severity="error" sx={{mb:1}}>{errorMessage}</Alert>}
    </div>
  );
}
