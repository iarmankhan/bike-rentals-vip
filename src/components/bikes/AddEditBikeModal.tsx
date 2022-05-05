import { FC } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  FormGroup,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { Bike } from "src/types/bikes.types";
import * as Yup from "yup";

interface AddEditBikeModalProps {
  open: boolean;
}

const AddEditBikeSchema = Yup.object().shape({
  color: Yup.string().required("Color is required"),
  model: Yup.string().required("Model is required"),
  location: Yup.string().required("Location is required"),
  isAvailable: Yup.boolean().required("Availability is required"),
});

const AddEditBikeModal: FC<AddEditBikeModalProps> = ({ open }) => {
  const { errors, values, touched, handleBlur, handleChange } = useFormik<Bike>(
    {
      validationSchema: AddEditBikeSchema,
      initialValues: {
        color: "",
        isAvailable: false,
        location: "",
        model: "",
        rating: 0,
      },
      onSubmit: (data) => {
        console.log(data);
      },
    }
  );

  return (
    <Dialog open={open}>
      <Paper>
        <Typography variant="h6">Add Bike</Typography>

        <form>
          <Box>
            <Box mt={3}>
              <TextField
                id="model"
                name="model"
                value={values.model}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.model && !!errors.model}
                helperText={(touched.model && errors.model) || ""}
                label="Model"
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
              />
            </Box>

            <FormGroup>
              <FormControlLabel
                id="isAvailable"
                name="isAvailable"
                control={<Checkbox defaultChecked />}
                label="Available for rent?"
              />
            </FormGroup>

            <Button variant="contained">Add Bike</Button>
          </Box>
        </form>
      </Paper>
    </Dialog>
  );
};

export default AddEditBikeModal;
