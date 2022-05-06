import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import MainLayout from "src/layout/MainLayout";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddEditBikeModal from "src/components/bikes/AddEditBikeModal";
import { getBikes } from "src/api/bikes";
import { Bike } from "src/types/bikes.types";
import { GridColDef } from "@mui/x-data-grid";
import StyledDataGrid from "src/components/ui/StyledDataGrid";
import ActionMenu from "src/components/ui/ActionMenu";
import { getAverageRating } from "src/utils/getAverageRating";

interface BikesProps {}

interface Filters {
  location: string;
  model: string;
  color: string;
  rating: string | number;
}

const FILTER_INITIAL_STATE: Filters = {
  location: "",
  model: "",
  color: "",
  rating: "",
};

const Bikes: FC<BikesProps> = () => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Bike | undefined>(undefined);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [filteredBikes, setFilteredBikes] = useState<Bike[]>([]);

  const [filters, setFilters] = useState<Filters>(FILTER_INITIAL_STATE);

  const fetchBikes = useCallback(async () => {
    const fetchedBikes = await getBikes();
    setBikes(fetchedBikes);
    setFilteredBikes(fetchedBikes);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchBikes().then(() => {
      setLoading(false);
    });
  }, []);

  const handleFilterChange = useCallback(
    (event: ChangeEvent<{ name: string; value: string }>) => {
      setFilters((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    },
    []
  );

  useEffect(() => {
    const newFilteredBikes = bikes.filter((bike) => {
      const { location, model, color, rating } = filters;

      if (location === "" && model === "" && color === "" && rating === "")
        return true;

      return (
        (location === "" ||
          bike.location.toLowerCase().includes(location.toLowerCase())) &&
        (model === "" ||
          bike.model.toLowerCase().includes(model.toLowerCase())) &&
        (color === "" ||
          bike.color.toLowerCase().includes(color.toLowerCase())) &&
        (rating === "" ||
          Math.floor(getAverageRating(bike?.rating || {})) === Number(rating))
      );
    });

    setFilteredBikes(newFilteredBikes);
  }, [filters, bikes]);

  const columns: GridColDef[] = [
    {
      field: "model",
      headerName: "Model",
      minWidth: 250,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>{params.row.model}</Typography>
        </Box>
      ),
    },
    {
      field: "color",
      headerName: "Color",
      minWidth: 250,
      flex: 1,
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
      minWidth: 250,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>{params.row.location}</Typography>
        </Box>
      ),
    },
    {
      field: "rating",
      headerName: "Rating",
      minWidth: 250,
      sortable: true,
      renderCell: (params) => {
        const avgRating = getAverageRating(params.row.rating);
        return (
          <Box width="100%">
            <Typography>{avgRating}</Typography>
          </Box>
        );
      },
    },
    {
      field: "is_available",
      headerName: "Available for rent?",
      minWidth: 250,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box width="100%">
          <Typography>
            {params.row.is_available ? "Available" : "Not Available"}
          </Typography>
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
              setSelectedBike(params.row);
              setOpen(true);
            }}
            onDeleteClick={() => true}
          />
        </Box>
      ),
    },
  ];

  return (
    <MainLayout>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h1">Bikes</Typography>
          <Button
            onClick={() => {
              setSelectedBike(undefined);
              setOpen(true);
            }}
            variant="contained"
            color="primary"
          >
            Add Bike
          </Button>
        </Box>

        <Box
          mt={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
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
                <em>None</em>
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
          open={open}
          onClose={() => setOpen(false)}
          onBikeAdded={() => {
            setOpen(false);
            fetchBikes();
          }}
        />
      </Box>
    </MainLayout>
  );
};

export default Bikes;
