import { FC } from "react";
import AuthForm from "src/components/authentication/AuthForm";
import { Box, Typography } from "@mui/material";
import useIsLoggedIn from "src/hooks/useIsLoggedIn";

interface SignupProps {}

const Signup: FC<SignupProps> = () => {
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
          <Typography variant="h1">Sign up</Typography>
        </Box>
        <AuthForm type="signup" />
      </Box>
    </Box>
  );
};

export default Signup;
