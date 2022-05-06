import { FC } from "react";
import { Box, Typography } from "@mui/material";
import AuthForm from "src/components/authentication/AuthForm";

interface LoginProps {}

const Login: FC<LoginProps> = () => (
  <Box>
    <Box
      sx={{ height: "100vh" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box>
        <Typography variant="h1">Login</Typography>
      </Box>
      <AuthForm type="login" />
    </Box>
  </Box>
);

export default Login;
