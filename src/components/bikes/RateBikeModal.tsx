import { FC, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
} from "@mui/material";
import Button from "@mui/lab/LoadingButton";
import useStore from "src/store";
import { Bike } from "src/types/bikes.types";
import { editBike } from "src/api/bikes";
import { toast } from "react-toastify";

interface RateBikeModalProps {
  open: boolean;
  onClose: () => void;
  bike?: Bike;
  onSuccess: () => void;
}

const RateBikeModal: FC<RateBikeModalProps> = ({
  open,
  onClose,
  bike,
  onSuccess,
}) => {
  const user = useStore((state) => state.user);

  const [givenRating, setGivenRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setGivenRating(null);
    onClose();
  };

  const rateBike = async () => {
    if (!bike || !bike.id || !user || !user?.id) return;

    setLoading(true);
    await editBike(bike?.id, {
      rating: bike?.rating
        ? {
            ...bike?.rating,
            [user.id]: givenRating || 0,
          }
        : {
            [user.id]: givenRating || 0,
          },
    });

    toast.success("Bike rated successfully");

    setLoading(false);
    setGivenRating(null);
    onSuccess();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      scroll="body"
    >
      <DialogTitle>Rate Bike</DialogTitle>
      <DialogContent dividers>
        <form id="reserve-bike-form">
          <Box display="flex" alignItems="center" justifyContent="center">
            <Rating
              name="half-rating"
              value={givenRating}
              onChange={(e, newValue) => {
                setGivenRating(newValue);
              }}
              size="large"
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button loading={loading} variant="contained" onClick={rateBike}>
          Rate Bike
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RateBikeModal;
