import { FC, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Button from "@mui/lab/LoadingButton";
import { Bike } from "src/types/bikes.types";
import { DateRangePicker, Range } from "react-date-range";
import { createReservation, getBikeReservations } from "src/api/bike-user";
import useStore from "src/store";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import { toast } from "react-toastify";
import moment from "moment";

interface ReserveBikeProps {
  open: boolean;
  onClose: () => void;
  onReservationSuccess: () => void;
  bike?: Bike;
}

const ReserveBike: FC<ReserveBikeProps> = ({
  open,
  onClose,
  onReservationSuccess,
  bike,
}) => {
  const user = useStore((state) => state.user);

  const [reservedDates, setReservedDates] = useState<Date[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [selectedRange, setSelectedRange] = useState<Range>({
    startDate: moment().startOf("day").toDate(),
    endDate: moment().startOf("day").toDate(),
    key: "selection",
  });

  const handleClose = () => {
    setLoading(false);
    setSelectedRange({
      startDate: moment().startOf("day").toDate(),
      endDate: moment().startOf("day").toDate(),
      key: "selection",
    });
    onClose();
  };

  const reserveBike = async () => {
    if (
      !bike ||
      !user ||
      !user.id ||
      !bike.id ||
      !selectedRange.startDate ||
      !selectedRange.endDate
    ) {
      toast.error("Invalid input");
      return;
    }

    if (
      reservedDates.some((date) =>
        moment(date).isBetween(
          moment(selectedRange.startDate),
          moment(selectedRange.endDate),
          "days",
          "[]"
        )
      )
    ) {
      toast.error("Bike is already reserved for this date range");
      return;
    }

    setLoading(true);

    const response = await createReservation(
      bike.id,
      user.id,
      selectedRange.startDate,
      selectedRange.endDate
    );

    setLoading(false);

    if (!response) {
      toast.error("Some errors occurred, please try again later");
    } else {
      toast.success("Bike reserved successfully");

      setSelectedRange({
        startDate: moment().startOf("day").toDate(),
        endDate: moment().startOf("day").toDate(),
        key: "selection",
      });

      onReservationSuccess();
    }
  };

  useEffect(() => {
    if (bike && bike.id && open) {
      setInitialLoading(true);
      getBikeReservations(bike.id).then(({ reservations }) => {
        setReservedDates(
          reservations
            ?.map((reservation) =>
              eachDayOfInterval({
                start: new Date(reservation.startDate.seconds * 1000),
                end: new Date(reservation.endDate.seconds * 1000),
              })
            )
            .flat() || []
        );
        setInitialLoading(false);
      });
    }
  }, [bike, open]);

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
            {initialLoading ? (
              <Box
                minHeight={200}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <CircularProgress />
              </Box>
            ) : (
              <DateRangePicker
                ranges={[selectedRange]}
                onChange={(range) => {
                  setSelectedRange(range.selection);
                }}
                staticRanges={[]}
                minDate={new Date()}
                disabledDates={reservedDates}
              />
            )}
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
