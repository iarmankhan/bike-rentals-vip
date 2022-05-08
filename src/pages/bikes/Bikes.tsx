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
import ReserveBike from "src/components/bikes/ReserveBike";
import useStore from "src/store";
import RateBikeModal from "src/components/bikes/RateBikeModal";
import { useNavigate } from "react-router-dom";
import DeleteModal from "src/components/ui/DeleteModal";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CancelReservationModal from "src/components/bikes/CancelReservationModal";

interface BikesProps {}

const Bikes: FC<BikesProps> = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [openCancelReservationModal, setOpenCancelReservationModal] =
    useState(false);
  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openReserveModal, setOpenReserveModal] = useState(false);
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Bike | undefined>(undefined);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [filteredBikes, setFilteredBikes] = useState<Bike[]>([]);

  const fetchBikes = useCallback(async () => {
    const fetchedBikes = await getBikes(user);
    setBikes(fetchedBikes);
    setFilteredBikes(fetchedBikes);
  }, [user]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchBikes().then(() => {
        setLoading(false);
      });
    }
  }, [user]);

  const columns: GridColDef[] = [
    {
      field: "model",
      headerName: "Model",
      minWidth: 150,
      sortable: true,
      flex: 1,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>{params.row.model}</Typography>
        </Box>
      ),
    },
    {
      field: "color",
      headerName: "Color",
      minWidth: 50,
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
      minWidth: 100,
      sortable: true,
      flex: 1,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>{params.row.location}</Typography>
        </Box>
      ),
    },
    {
      field: "rating",
      headerName: "Rating",
      minWidth: 20,
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
      minWidth: 50,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>
            {params.row.isAvailable ? (
              <EventAvailableIcon color="primary" />
            ) : (
              <EventBusyIcon color="error" />
            )}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      minWidth: 300,
      flex: 1,
      renderCell: (params) => (
        <Box width="100%" display="flex" alignItems="center">
          {user?.role !== "manager" ? (
            <>
              <Button
                variant="outlined"
                sx={{ marginRight: "5px", padding: "3px " }}
                onClick={() => {
                  setSelectedBike(params.row);
                  setOpenRatingModal(true);
                }}
              >
                Rate
              </Button>

              {params.row?.isReservedByUser ? (
                <Button
                  variant="contained"
                  color="error"
                  sx={{ padding: "5px 10px" }}
                  onClick={() => {
                    setSelectedBike(params.row);
                    setOpenCancelReservationModal(true);
                  }}
                >
                  Cancel Reservation
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{ padding: "5px 10px" }}
                  onClick={() => {
                    setSelectedBike(params.row);
                    setOpenReserveModal(true);
                  }}
                  disabled={!params.row.isAvailable}
                >
                  Reserve
                </Button>
              )}
            </>
          ) : (
            <ActionMenu
              onEditClick={() => {
                setSelectedBike(params.row);
                setOpenAddEditModal(true);
              }}
              onDeleteClick={() => {
                setSelectedBike(params.row);
                setOpenDeleteModal(true);
              }}
              moreActions={[
                {
                  label: "View Reservations",
                  onClick: () => {
                    navigate(`/bikes/${params.row.id}/reservations/`);
                  },
                },
              ]}
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
          onClose={() => {
            setOpenAddEditModal(false);
            setSelectedBike(undefined);
          }}
          onBikeAdded={() => {
            setOpenAddEditModal(false);
            setSelectedBike(undefined);
            fetchBikes();
          }}
        />

        <DeleteModal
          bike={selectedBike}
          open={openDeleteModal}
          onClose={() => {
            setOpenDeleteModal(false);
            setSelectedBike(undefined);
          }}
          onItemDeleted={() => {
            setOpenDeleteModal(false);
            setSelectedBike(undefined);
            fetchBikes();
          }}
        />

        <ReserveBike
          bike={selectedBike}
          open={openReserveModal}
          onClose={() => {
            setOpenReserveModal(false);
            setSelectedBike(undefined);
          }}
          onReservationSuccess={() => {
            setOpenReserveModal(false);
            setSelectedBike(undefined);
            fetchBikes();
          }}
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
            setSelectedBike(undefined);
            fetchBikes();
          }}
        />

        <CancelReservationModal
          open={openCancelReservationModal}
          onClose={() => {
            setOpenCancelReservationModal(false);
            setSelectedBike(undefined);
          }}
          onReservationCancel={() => {
            setOpenCancelReservationModal(false);
            setSelectedBike(undefined);
            fetchBikes();
          }}
          bike={selectedBike}
          user={user || undefined}
        />
      </Box>
    </MainLayout>
  );
};

export default Bikes;
