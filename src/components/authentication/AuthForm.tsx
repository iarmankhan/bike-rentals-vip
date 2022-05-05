import { FC, useState } from "react";
import { useFormik } from "formik";
import Button from "@mui/lab/LoadingButton";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { login, register } from "src/api/authentication";

interface AuthFormDTO {
  role?: string;
  email: string;
  password: string;
}

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthFormSchema = Yup.object().shape({
  role: Yup.string().optional(),
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
        role: "",
        email: "",
        password: "",
      },
      onSubmit: async ({ password, email, role }) => {
        setLoading(true);

        let res = null;
        if (type === "login") {
          res = await login(email, password);
        } else {
          res = await register(email, password, `${role}`);
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
        {type === "signup" && (
          <Box>
            <FormControl error={touched.role && !!errors.role}>
              <FormLabel id="user-role-radio-group-label">Role</FormLabel>
              <RadioGroup
                row
                aria-labelledby="user-role-radio-group-label"
                name="user-role-radio-group"
                value={values.role}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="manager"
                  control={<Radio />}
                  label="Manager"
                />
                <FormControlLabel
                  value="user"
                  control={<Radio />}
                  label="User"
                />
              </RadioGroup>

              {touched.role && errors.role && (
                <FormHelperText>{errors.role}</FormHelperText>
              )}
            </FormControl>
          </Box>
        )}
        <Box mt={3}>
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