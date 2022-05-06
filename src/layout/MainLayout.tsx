import { FC, ReactNode } from "react";
import { Box, Container } from "@mui/material";
import NavBar from "src/components/ui/NavBar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => (
  <Box>
    <NavBar />
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      {children}
    </Container>
  </Box>
);

export default MainLayout;
