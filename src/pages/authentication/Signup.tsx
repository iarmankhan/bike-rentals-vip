import { FC } from "react";
import AuthForm from "src/components/authentication/AuthForm";
import { Box, Typography } from "@mui/material";
import useIsLoggedIn from "src/hooks/useIsLoggedIn";
import { Link } from "react-router-dom";

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

        <Box mt={2} display="flex" alignItems="center" justifyContent="center">
          <Typography>
            <Link to="/">Have an account? Login</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
