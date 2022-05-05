import { FC } from "react";
import AuthForm from "src/components/authentication/AuthForm";
import MainLayout from "src/layout/MainLayout";
import { Box, Typography } from "@mui/material";

interface SignupProps {}

const Signup: FC<SignupProps> = () => (
  <MainLayout>
    <Box
      sx={{ height: "100vh" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box>
        <Typography variant="h1">Sign up</Typography>
      </Box>
      <AuthForm type="signup" />
    </Box>
  </MainLayout>
);

export default Signup;
