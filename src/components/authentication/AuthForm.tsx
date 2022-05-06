import { FC, useState } from "react";
import { useFormik } from "formik";
import Button from "@mui/lab/LoadingButton";
import { Box, TextField } from "@mui/material";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { login, register } from "src/api/authentication";

interface AuthFormDTO {
  email: string;
  password: string;
}

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthFormSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Password is required"),
});

const AuthForm: FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik<AuthFormDTO>({
      validationSchema: AuthFormSchema,
      initialValues: {
        email: "",
        password: "",
      },
      onSubmit: async ({ password, email }) => {
        setLoading(true);

        let res = null;
        if (type === "login") {
          res = await login(email, password);
        } else {
          res = await register(email, password, `user`);
        }

        if (res) navigate("/");

        setLoading(false);
      },
    });

  return (
    <form onSubmit={handleSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        sx={{ width: { sm: 300, md: 500 } }}
      >
        <Box mt={1}>
          <TextField
            id="email"
            name="email"
            label="Email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && !!errors.email}
            helperText={(touched.email && errors.email) || ""}
            fullWidth
          />
        </Box>
        <Box mt={3}>
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && !!errors.password}
            helperText={(touched.password && errors.password) || ""}
            fullWidth
          />
        </Box>

        <Button
          sx={{ mt: 3 }}
          loading={loading}
          variant="contained"
          type="submit"
        >
          {type === "login" ? "Login" : "Register"}
        </Button>
      </Box>
    </form>
  );
};

export default AuthForm;
