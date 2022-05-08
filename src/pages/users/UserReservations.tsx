import { FC } from "react";
import MainLayout from "src/layout/MainLayout";
import { Box, Typography } from "@mui/material";

interface UserReservationsProps {}

const UserReservations: FC<UserReservationsProps> = () => (
  <MainLayout>
    <Box>
      <Typography variant="h1">User Reservations</Typography>
    </Box>

    <Box>
      <Typography variant="h6">Model: </Typography>
    </Box>
  </MainLayout>
);

export default UserReservations;
