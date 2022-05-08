import { FC, useCallback, useEffect, useState } from "react";
import MainLayout from "src/layout/MainLayout";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import AddEditBikeModal from "src/components/bikes/AddEditBikeModal";
import { getBikes } from "src/api/bikes";
import { Bike } from "src/types/bikes.types";
import { GridColDef } from "@mui/x-data-grid";
import StyledDataGrid from "src/components/ui/StyledDataGrid";
import ActionMenu from "src/components/ui/ActionMenu";
import { getAverageRating } from "src/utils/getAverageRating";
import BikeFilters from "src/components/bikes/BikeFilters";
import ReserveBike from "src/components/bikes/ReserveBike";
import useStore from "src/store";
import RateBikeModal from "src/components/bikes/RateBikeModal";

interface BikesProps {}

const Bikes: FC<BikesProps> = () => {
  const user = useStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [openReserveModal, setOpenReserveModal] = useState(false);
  const [openRatingModal, setOpenRatingModal] = useState(false);
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
        const avgRating = params.row.rating
          ? getAverageRating(params.row.rating)
          : 0;
        return (
          <Box width="100%">
            <Typography>{avgRating}</Typography>
          </Box>
        );
      },
    },
    {
      field: "isAvailable",
      headerName: "Available for rent?",
      minWidth: 250,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>
            {params.row.isAvailable ? "Available" : "Not Available"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      minWidth: 200,
      renderCell: (params) => (
        <Box width="100%" display="flex" alignItems="center">
          {user?.role !== "manager" ? (
            <Stack direction="row" spacing={1}>
              <Button
                onClick={() => {
                  setSelectedBike(params.row);
                  setOpenRatingModal(true);
                }}
              >
                Rate
              </Button>

              <Button
                onClick={() => {
                  setSelectedBike(params.row);
                  setOpenReserveModal(true);
                }}
                disabled={!params.row.isAvailable}
              >
                Reserve
              </Button>
            </Stack>
          ) : (
            <ActionMenu
              onEditClick={() => {
                setSelectedBike(params.row);
                setOpenAddEditModal(true);
              }}
              onDeleteClick={() => true}
            />
          )}
        </Box>
      ),
    },
  ];

  return (
    <MainLayout>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h1">Bikes</Typography>
          {user?.role === "manager" && (
            <Button
              onClick={() => {
                setSelectedBike(undefined);
                setOpenAddEditModal(true);
              }}
              variant="contained"
              color="primary"
            >
              Add Bike
            </Button>
          )}
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
          open={openAddEditModal}
          onClose={() => setOpenAddEditModal(false)}
          onBikeAdded={() => {
            setOpenAddEditModal(false);
            fetchBikes();
          }}
        />

        <ReserveBike
          bike={selectedBike}
          open={openReserveModal}
          onClose={() => setOpenReserveModal(false)}
        />

        <RateBikeModal
          open={openRatingModal}
          bike={selectedBike}
          onClose={() => {
            setOpenRatingModal(false);
            setSelectedBike(undefined);
          }}
          onSuccess={() => {
            setOpenRatingModal(false);
            fetchBikes();
          }}
        />
      </Box>
    </MainLayout>
  );
};

export default Bikes;
