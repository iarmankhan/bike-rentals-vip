import { FC } from "react";
import MainLayout from "src/layout/MainLayout";
import { Box, Typography } from "@mui/material";
import AuthForm from "src/components/authentication/AuthForm";

interface LoginProps {}

const Login: FC<LoginProps> = () => (
  <MainLayout>
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
  </MainLayout>
);

export default Login;
