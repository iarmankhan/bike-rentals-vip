import { FC, useCallback, useEffect, useState } from "react";
import MainLayout from "src/layout/MainLayout";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import AddEditUserModal from "src/components/users/AddEditUserModal";
import { getUsers } from "src/api/users";
import { User } from "src/types/users.types";
import { GridColDef } from "@mui/x-data-grid";
import StyledDataGrid from "src/components/ui/StyledDataGrid";
import ActionMenu from "src/components/ui/ActionMenu";
import { useNavigate } from "react-router-dom";
import useStore from "src/store";
import DeleteModal from "src/components/ui/DeleteModal";

interface UsersProps {}

const Users: FC<UsersProps> = () => {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  }, []);

  useEffect(() => {
    if (user?.role === "user") {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    fetchUsers().then(() => {
      setLoading(false);
    });
  }, []);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 250,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>{params.row.name}</Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>{params.row.email}</Typography>
        </Box>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 250,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>{params.row.role}</Typography>
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
              setSelectedUser(params.row);
              setOpen(true);
            }}
            onDeleteClick={() => {
              setSelectedUser(params.row);
              setOpenDeleteModal(true);
            }}
            moreActions={[
              {
                label: "View Reservations",
                onClick: () => {
                  navigate(`/users/${params.row.id}/reservations/`);
                },
              },
            ]}
          />
        </Box>
      ),
    },
  ];

  return (
    <MainLayout>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h1">Users</Typography>
          <Button
            onClick={() => {
              setSelectedUser(undefined);
              setOpen(true);
            }}
            variant="contained"
            color="primary"
          >
            Add User
          </Button>
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

          {!loading && !users.length && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height={200}
            >
              <Typography variant="h5">No users found</Typography>
            </Box>
          )}

          {!loading && users.length && (
            <StyledDataGrid
              columns={columns}
              rows={users}
              headerHeight={40}
              disableSelectionOnClick
              hideFooter
              autoHeight
              disableColumnMenu
              disableColumnSelector
            />
          )}
        </Box>

        <AddEditUserModal
          user={selectedUser}
          open={open}
          onClose={() => setOpen(false)}
          onUserAdded={() => {
            setOpen(false);
            fetchUsers();
          }}
        />
        <DeleteModal
          user={selectedUser}
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onItemDeleted={() => {
            setOpenDeleteModal(false);
            fetchUsers();
          }}
        />
      </Box>
    </MainLayout>
  );
};

export default Users;
