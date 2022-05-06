import { FC, useEffect, useState } from "react";
import Button from "@mui/lab/LoadingButton";
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { Bike } from "src/types/bikes.types";
import * as Yup from "yup";
import { addBike, editBike } from "src/api/bikes";

interface AddEditBikeModalProps {
  open: boolean;
  onClose: () => void;
  onBikeAdded: () => void;
  bike?: Bike;
}

const AddEditBikeSchema = Yup.object().shape({
  color: Yup.string().required("Color is required"),
  model: Yup.string().required("Model is required"),
  location: Yup.string().required("Location is required"),
  isAvailable: Yup.boolean().required("Availability is required"),
});

const AddEditBikeModal: FC<AddEditBikeModalProps> = ({
  open,
  onClose,
  onBikeAdded,
  bike,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    errors,
    values,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
    resetForm,
    setFieldValue,
  } = useFormik<Bike>({
    validationSchema: AddEditBikeSchema,
    initialValues: {
      color: "",
      isAvailable: false,
      location: "",
      model: "",
      rating: 0,
    },
    onSubmit: async (data) => {
      setLoading(true);

      if (bike && bike.id) {
        await editBike(bike.id, data);
      } else {
        await addBike(data);
      }
      setLoading(false);
      onBikeAdded();
    },
  });

  useEffect(() => {
    if (bike) {
      setFieldValue("color", bike.color);
      setFieldValue("isAvailable", bike.isAvailable);
      setFieldValue("location", bike.location);
      setFieldValue("model", bike.model);
    }
  }, [bike]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      scroll="body"
    >
      <DialogTitle>Add Bike</DialogTitle>
      <DialogContent dividers>
        <form id="bike-form" onSubmit={handleSubmit}>
          <Box>
            <Box mt={1}>
              <TextField
                id="model"
                name="model"
                value={values.model}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.model && !!errors.model}
                helperText={(touched.model && errors.model) || ""}
                label="Model"
                fullWidth
              />
            </Box>
            <Box mt={3}>
              <TextField
                id="color"
                name="color"
                value={values.color}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.color && !!errors.color}
                helperText={(touched.color && errors.color) || ""}
                label="Color"
                fullWidth
              />
            </Box>
            <Box mt={3}>
              <TextField
                id="location"
                name="location"
                value={values.location}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.location && !!errors.location}
                helperText={(touched.location && errors.location) || ""}
                label="Location"
                fullWidth
              />
            </Box>

            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel
                id="isAvailable"
                name="isAvailable"
                control={<Checkbox defaultChecked />}
                label="Available for rent?"
              />
            </FormGroup>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button
          loading={loading}
          variant="contained"
          type="submit"
          form="bike-form"
        >
          Add Bike
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditBikeModal;
