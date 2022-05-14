import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Bike, BikeFiltersType } from "src/types/bikes.types";
import { getAverageRating } from "src/utils/getAverageRating";
import moment from "moment";
import eachDayOfInterval from "date-fns/eachDayOfInterval";

interface BikeFiltersProps {
  bikes: Bike[];
  onBikeFilter: (filteredBikes: Bike[]) => void;
}

const FILTER_INITIAL_STATE: BikeFiltersType = {
  location: "",
  model: "",
  color: "",
  rating: "",
  startDate: "",
  endDate: "",
};

const BikeFilters: FC<BikeFiltersProps> = ({ bikes, onBikeFilter }) => {
  const [filters, setFilters] = useState<BikeFiltersType>(FILTER_INITIAL_STATE);

  useEffect(() => {
    const newFilteredBikes = bikes.filter((bike) => {
      const { location, model, color, rating, startDate, endDate } = filters;

      if (
        location === "" &&
        model === "" &&
        color === "" &&
        rating === "" &&
        startDate === "" &&
        endDate === ""
      )
        return true;

      return (
        (location === "" ||
          bike.location.toLowerCase().includes(location.toLowerCase())) &&
        (model === "" ||
          bike.model.toLowerCase().includes(model.toLowerCase())) &&
        (color === "" ||
          bike.color.toLowerCase().includes(color.toLowerCase())) &&
        (rating === "" ||
          Math.floor(getAverageRating(bike?.rating || {})) ===
            Number(rating)) &&
        (startDate === "" ||
          endDate === "" ||
          bike?.reservations?.every((reservation) => {
            const allDates = eachDayOfInterval({
              start: moment(startDate).toDate(),
              end: moment(endDate).toDate(),
            }).flat();

            return allDates.every(
              (date) =>
                !moment(date).isBetween(
                  moment.unix(reservation.startDate.seconds),
                  moment.unix(reservation.endDate.seconds),
                  "days",
                  "[]"
                )
            );
          }))
      );
    });
    onBikeFilter(newFilteredBikes);
  }, [filters, bikes]);

  const handleFilterChange = useCallback(
    (event: ChangeEvent<{ name: string; value: string }>) => {
      setFilters((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    },
    []
  );
  return (
    <Box
      mt={2}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <TextField
        id="startDate"
        label="Start Date"
        name="startDate"
        type="date"
        size="small"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: moment().format("YYYY-MM-DD"),
        }}
        value={filters.startDate}
        onChange={handleFilterChange}
      />
      <TextField
        id="endDate"
        label="End Date"
        name="endDate"
        type="date"
        size="small"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: filters?.startDate
            ? moment(filters?.startDate).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD"),
        }}
        value={filters.endDate}
        onChange={handleFilterChange}
      />
      <TextField
        name="model"
        id="model"
        label="Model"
        variant="outlined"
        size="small"
        value={filters.model}
        onChange={handleFilterChange}
      />
      <TextField
        id="color"
        name="color"
        label="Color"
        variant="outlined"
        size="small"
        value={filters.color}
        onChange={handleFilterChange}
      />
      <TextField
        id="location"
        name="location"
        label="Location"
        variant="outlined"
        size="small"
        value={filters.location}
        onChange={handleFilterChange}
      />
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="rating">Rating</InputLabel>
        <Select
          labelId="rating"
          id="rating"
          name="rating"
          value={filters.rating}
          label="Rating"
          onChange={(e) => {
            handleFilterChange(e as any);
          }}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {[...Array(5).keys()].map((i) => (
            <MenuItem key={i} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        onClick={() => {
          setFilters(FILTER_INITIAL_STATE);
        }}
      >
        Clear Filters
      </Button>
    </Box>
  );
};

export default BikeFilters;
