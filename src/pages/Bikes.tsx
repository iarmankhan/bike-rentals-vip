import { FC } from "react";
import MainLayout from "src/layout/MainLayout";
import { Box, Button, Typography } from "@mui/material";
import AddEditBikeModal from "src/components/bikes/AddEditBikeModal";

interface BikesProps {}

const Bikes: FC<BikesProps> = () => (
  <MainLayout>
    <Box>
      <Box>
        <Typography variant="h1">Bikes</Typography>
        <Button variant="contained" color="primary">
          Add Bike
        </Button>
      </Box>

      <AddEditBikeModal open={false} />
    </Box>
  </MainLayout>
);

export default Bikes;
