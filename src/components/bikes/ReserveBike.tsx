import { FC, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Button from "@mui/lab/LoadingButton";
import { Bike } from "src/types/bikes.types";
import { DateRangePicker, Range } from "react-date-range";
import { createReservation } from "src/api/bike-user";

interface ReserveBikeProps {
  open: boolean;
  onClose: () => void;
  bike?: Bike;
}

const ReserveBike: FC<ReserveBikeProps> = ({ open, onClose, bike }) => {
  const [loading, setLoading] = useState(false);

  const [selectedRange, setSelectedRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleClose = () => {
    setLoading(false);
    console.log(bike);
    onClose();
  };

  const reserveBike = async () => {
    if (!bike || !bike.id || !selectedRange.startDate || !selectedRange.endDate)
      return;

    setLoading(true);

    const response = await createReservation(
      bike.id,
      "user1",
      selectedRange.startDate,
      selectedRange.endDate
    );

    setLoading(false);

    if (!response) {
      console.log("Error");
    } else {
      handleClose();
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
      <DialogTitle>Reserve Bike</DialogTitle>
      <DialogContent dividers>
        <form id="reserve-bike-form">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              "& .rdrDefinedRangesWrapper": {
                display: "none",
              },
            }}
          >
            <DateRangePicker
              ranges={[selectedRange]}
              onChange={(range) => {
                console.log(range);
                setSelectedRange(range.selection);
              }}
              staticRanges={[]}
              minDate={new Date()}
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button loading={loading} variant="contained" onClick={reserveBike}>
          Reserve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReserveBike;
