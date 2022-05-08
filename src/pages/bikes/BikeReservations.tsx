import { FC, useCallback, useEffect, useState } from "react";
import MainLayout from "src/layout/MainLayout";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Bike, Reservation } from "src/types/bikes.types";
import { getBikeReservations } from "src/api/bike-user";
import { GridColDef } from "@mui/x-data-grid";
import StyledDataGrid from "src/components/ui/StyledDataGrid";
import moment from "moment";

interface BikeReservationsProps {}

const BikeReservations: FC<BikeReservationsProps> = () => {
  const { bikeId } = useParams();

  const [loading, setLoading] = useState(false);
  const [bike, setBike] = useState<Bike | null>();
  const [reservations, setReservations] = useState<Reservation[] | null>([]);

  const fetchReservations = useCallback(async () => {
    if (!bikeId) return;

    const response = await getBikeReservations(bikeId);

    setReservations(response.reservations);
    setBike(response.bike);
  }, [bikeId]);

  useEffect(() => {
    setLoading(true);
    fetchReservations().then(() => setLoading(false));
  }, []);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "User Name",
      width: 200,
      sortable: true,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Typography>{params.row.user.name}</Typography>
        </Box>
      ),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      minWidth: 250,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>
            {moment.unix(params.row.startDate.seconds).format("DD/MM/YYYY")}
          </Typography>
        </Box>
      ),
    },
    {
      field: "endDate",
      headerName: "End Date",
      minWidth: 250,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>
            {moment.unix(params.row.endDate.seconds).format("DD/MM/YYYY")}
          </Typography>
        </Box>
      ),
    },
    {
      field: "totalDays",
      headerName: "Total Days",
      minWidth: 100,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const totalDays = moment
          .unix(params.row.endDate.seconds)
          .diff(moment.unix(params.row.startDate.seconds), "days");
        return (
          <Box width="100%">
            <Typography>{totalDays}</Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <MainLayout>
      {!reservations ? (
        <Box>
          <Typography variant="h4">Invalid Bike</Typography>
        </Box>
      ) : (
        <>
          <Box>
            <Typography variant="h1">Bike Reservations</Typography>
          </Box>

          {loading ? (
            <Box>
              <CircularProgress />
            </Box>
          ) : (
            <Box mt={3}>
              <Box>
                <Typography variant="subtitle1">
                  Model: {bike?.model}
                </Typography>
                <Typography variant="subtitle1">
                  Color: {bike?.color}
                </Typography>
                <Typography variant="subtitle1">
                  Avg Rating: {bike?.model}
                </Typography>
                <Typography variant="subtitle1">
                  Location: {bike?.location}
                </Typography>
              </Box>

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

                {!loading && !reservations.length && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height={200}
                  >
                    <Typography variant="h5">No reservations yet</Typography>
                  </Box>
                )}

                {!loading && !!reservations.length && (
                  <StyledDataGrid
                    columns={columns}
                    rows={reservations}
                    headerHeight={40}
                    disableSelectionOnClick
                    hideFooter
                    autoHeight
                    disableColumnMenu
                    disableColumnSelector
                  />
                )}
              </Box>
            </Box>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default BikeReservations;
