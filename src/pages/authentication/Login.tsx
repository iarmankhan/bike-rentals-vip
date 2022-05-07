import { FC } from "react";
import { Box, Typography } from "@mui/material";
import AuthForm from "src/components/authentication/AuthForm";
import useIsLoggedIn from "src/hooks/useIsLoggedIn";

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  useIsLoggedIn();

  return (
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
};

export default Login;
