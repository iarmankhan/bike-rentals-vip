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
import { cancelReservation } from "src/api/bike-user";
import { toast } from "react-toastify";

interface CancelReservationModalProps {
  open: boolean;
  onClose: () => void;
  onReservationCancel: () => void;
  user?: User;
  bike?: Bike;
}

const CancelReservationModal: FC<CancelReservationModalProps> = ({
  open,
  onClose,
  onReservationCancel,
  user,
  bike,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onClose();
    setLoading(false);
  };

  const handleReservationCancel = async () => {
    if (!bike || !bike.id || !user || !user.id) {
      toast.error("Bike or user not found");
      return;
    }

    setLoading(true);
    await cancelReservation(user.id, bike.id);
    setLoading(false);
    onReservationCancel();
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
          Your reservation will be cancelled for this bike
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button
          loading={loading}
          variant="contained"
          type="submit"
          color="error"
          onClick={handleReservationCancel}
        >
          Yes, Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelReservationModal;
