import { FC, ReactNode } from "react";
import { Box, Container } from "@mui/material";
import NavBar from "src/components/ui/NavBar";
import useIsLoggedIn from "src/hooks/useIsLoggedIn";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  useIsLoggedIn();

  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        {children}
      </Container>
    </Box>
  );
};

export default MainLayout;
