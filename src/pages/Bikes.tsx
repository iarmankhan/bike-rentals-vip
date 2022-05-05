import { FC, useCallback, useEffect, useState } from "react";
import MainLayout from "src/layout/MainLayout";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import AddEditBikeModal from "src/components/bikes/AddEditBikeModal";
import { getBikes } from "src/api/bikes";
import { Bike } from "src/types/bikes.types";

interface BikesProps {}

const Bikes: FC<BikesProps> = () => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [bikes, setBikes] = useState<Bike[]>([]);

  const fetchBikes = useCallback(async () => {
    const fetchedBikes = await getBikes();
    setBikes(fetchedBikes);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchBikes().then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <MainLayout>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h1">Bikes</Typography>
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            color="primary"
          >
            Add Bike
          </Button>
        </Box>

        <Box>
          {loading && <CircularProgress />}

          {!loading && !bikes.length && (
            <Typography variant="h5">No bikes found</Typography>
          )}

          {!loading && bikes.length && (
            <Box>
              {bikes.map((bike) => (
                <Box key={bike.id}>
                  <Typography variant="h5">{bike.model}</Typography>
                  <Typography variant="body1">{bike.color}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <AddEditBikeModal
          open={open}
          onClose={() => setOpen(false)}
          onBikeAdded={() => {
            setOpen(false);
            fetchBikes();
          }}
        />
      </Box>
    </MainLayout>
  );
};

export default Bikes;
