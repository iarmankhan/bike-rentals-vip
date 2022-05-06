import { FC, useCallback, useEffect, useState } from "react";
import MainLayout from "src/layout/MainLayout";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import AddEditBikeModal from "src/components/bikes/AddEditBikeModal";
import { getBikes } from "src/api/bikes";
import { Bike } from "src/types/bikes.types";
import { GridColDef } from "@mui/x-data-grid";
import StyledDataGrid from "src/components/ui/StyledDataGrid";
import ActionMenu from "src/components/ui/ActionMenu";
import { getAverageRating } from "src/utils/getAverageRating";
import BikeFilters from "src/components/bikes/BikeFilters";

interface BikesProps {}

const Bikes: FC<BikesProps> = () => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Bike | undefined>(undefined);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [filteredBikes, setFilteredBikes] = useState<Bike[]>([]);

  const fetchBikes = useCallback(async () => {
    const fetchedBikes = await getBikes();
    setBikes(fetchedBikes);
    setFilteredBikes(fetchedBikes);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchBikes().then(() => {
      setLoading(false);
    });
  }, []);

  const columns: GridColDef[] = [
    {
      field: "model",
      headerName: "Model",
      minWidth: 250,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>{params.row.model}</Typography>
        </Box>
      ),
    },
    {
      field: "color",
      headerName: "Color",
      minWidth: 250,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>{params.row.color}</Typography>
        </Box>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      minWidth: 250,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>{params.row.location}</Typography>
        </Box>
      ),
    },
    {
      field: "rating",
      headerName: "Rating",
      minWidth: 250,
      sortable: true,
      renderCell: (params) => {
        const avgRating = getAverageRating(params.row.rating);
        return (
          <Box width="100%">
            <Typography>{avgRating}</Typography>
          </Box>
        );
      },
    },
    {
      field: "is_available",
      headerName: "Available for rent?",
      minWidth: 250,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>
            {params.row.is_available ? "Available" : "Not Available"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <Box width="100%">
          <ActionMenu
            onEditClick={() => {
              setSelectedBike(params.row);
              setOpen(true);
            }}
            onDeleteClick={() => true}
          />
        </Box>
      ),
    },
  ];

  return (
    <MainLayout>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h1">Bikes</Typography>
          <Button
            onClick={() => {
              setSelectedBike(undefined);
              setOpen(true);
            }}
            variant="contained"
            color="primary"
          >
            Add Bike
          </Button>
        </Box>

        <BikeFilters
          bikes={bikes}
          onBikeFilter={(newFilteredBikes) =>
            setFilteredBikes(newFilteredBikes)
          }
        />

        <Box mt={3}>
          {loading && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height={200}
            >
              <CircularProgress />
            </Box>
          )}

          {!loading && !filteredBikes.length && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height={200}
            >
              <Typography variant="h5">No bikes found</Typography>
            </Box>
          )}

          {!loading && !!filteredBikes.length && (
            <StyledDataGrid
              columns={columns}
              rows={filteredBikes}
              headerHeight={40}
              disableSelectionOnClick
              hideFooter
              autoHeight
              disableColumnMenu
              disableColumnSelector
            />
          )}
        </Box>

        <AddEditBikeModal
          bike={selectedBike}
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
