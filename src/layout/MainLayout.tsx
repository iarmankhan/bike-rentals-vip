import { FC, ReactNode } from "react";
import { Container } from "@mui/material";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => (
  <Container maxWidth="md" sx={{ pt: 2 }}>
    {children}
  </Container>
);

export default MainLayout;
