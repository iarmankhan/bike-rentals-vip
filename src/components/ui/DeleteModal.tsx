import { FC, useState } from "react";
import Button from "@mui/lab/LoadingButton";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Bike } from "src/types/bikes.types";
import { User } from "src/types/users.types";
import { deleteUser } from "src/api/users";
import { deleteBike } from "src/api/bikes";
import { toast } from "react-toastify";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onItemDeleted: () => void;
  user?: User;
  bike?: Bike;
}

const DeleteModal: FC<DeleteModalProps> = ({
  open,
  onClose,
  onItemDeleted,
  user,
  bike,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onClose();
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    let res;
    if (user && user.id) {
      res = await deleteUser(user.id);
    } else if (bike && bike.id) {
      res = await deleteBike(bike.id);
    }
    setLoading(false);

    if (res) {
      toast.success("Item deleted successfully");
      onItemDeleted();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      scroll="body"
    >
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">
          You won&apos;t be able to recover this data later.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button
          loading={loading}
          variant="contained"
          color="error"
          type="submit"
          onClick={handleDelete}
        >
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
