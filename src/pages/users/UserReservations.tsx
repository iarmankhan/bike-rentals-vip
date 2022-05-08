import { FC, useCallback, useEffect, useState } from "react";
import MainLayout from "src/layout/MainLayout";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Reservation } from "src/types/bikes.types";
import { getUserReservations } from "src/api/bike-user";
import { GridColDef } from "@mui/x-data-grid";
import StyledDataGrid from "src/components/ui/StyledDataGrid";
import moment from "moment";
import { User } from "src/types/users.types";

interface UserReservationsProps {}

const UserReservations: FC<UserReservationsProps> = () => {
  const { userId } = useParams();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>();
  const [reservations, setReservations] = useState<Reservation[] | null>([]);

  const fetchReservations = useCallback(async () => {
    if (!userId) return;

    const response = await getUserReservations(userId);

    setReservations(response.reservations);
    setUser(response.user);
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    fetchReservations().then(() => setLoading(false));
  }, []);

  const columns: GridColDef[] = [
    {
      field: "model",
      headerName: "Bike Model",
      width: 200,
      sortable: true,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Typography>{params.row.bike.model}</Typography>
        </Box>
      ),
    },
    {
      field: "color",
      headerName: "Bike Color",
      width: 200,
      sortable: true,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Typography>{params.row.bike.color}</Typography>
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
          <Typography variant="h4">Invalid User</Typography>
        </Box>
      ) : (
        <>
          <Box>
            <Typography variant="h1">User Reservations</Typography>
          </Box>

          {loading ? (
            <Box>
              <CircularProgress />
            </Box>
          ) : (
            <Box mt={3}>
              <Box>
                <Typography variant="subtitle1">Name: {user?.name}</Typography>
                <Typography variant="subtitle1">
                  Email: {user?.email}
                </Typography>
                <Typography variant="subtitle1">Role: {user?.role}</Typography>
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

export default UserReservations;
