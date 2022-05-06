import { FC, useEffect, useState } from "react";
import Button from "@mui/lab/LoadingButton";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { User } from "src/types/users.types";
import * as Yup from "yup";
import { addUser, editUser } from "src/api/users";
import omit from "lodash/omit";

interface AddEditUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserAdded: () => void;
  user?: User;
}

const AddEditUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email().required("Email is required"),
  role: Yup.string().required("Role is required"),
  password: Yup.string().required("Password is required"),
});

const AddEditUserModal: FC<AddEditUserModalProps> = ({
  open,
  onClose,
  onUserAdded,
  user,
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
  } = useFormik<User>({
    validationSchema: AddEditUserSchema,
    initialValues: {
      name: "",
      email: "",
      role: "user",
      password: "",
    },
    onSubmit: async (data) => {
      setLoading(true);

      if (user && user.id) {
        await editUser(user.id, omit(data, ["password"]));
      } else {
        await addUser(data);
      }
      setLoading(false);
      onUserAdded();
    },
  });

  useEffect(() => {
    if (user) {
      setFieldValue("name", user.name);
      setFieldValue("email", user.email);
      setFieldValue("role", user.role);
      setFieldValue("password", "redacted");
    }
  }, [user]);

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
      <DialogTitle>Add User</DialogTitle>
      <DialogContent dividers>
        <form id="user-form" onSubmit={handleSubmit}>
          <Box>
            <Box mt={1}>
              <TextField
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && !!errors.name}
                helperText={(touched.name && errors.name) || ""}
                label="Name"
                fullWidth
              />
            </Box>
            <Box mt={3}>
              <TextField
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && !!errors.email}
                helperText={(touched.email && errors.email) || ""}
                label="Email"
                type="email"
                disabled={user && !!user.id}
                fullWidth
              />
            </Box>
            {!user && (
              <Box mt={3}>
                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && !!errors.password}
                  helperText={(touched.password && errors.password) || ""}
                  fullWidth
                />
              </Box>
            )}
            <Box mt={3}>
              <FormControl error={touched.role && !!errors.role}>
                <FormLabel id="user-role-radio-group-label">Role</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="user-role-radio-group-label"
                  name="user-role-radio-group"
                  value={values.role}
                  onChange={(e) => {
                    setFieldValue("role", e.target.value);
                  }}
                >
                  <FormControlLabel
                    value="manager"
                    control={<Radio />}
                    label="Manager"
                  />
                  <FormControlLabel
                    value="user"
                    control={<Radio />}
                    label="User"
                  />
                </RadioGroup>

                {touched.role && errors.role && (
                  <FormHelperText>{errors.role}</FormHelperText>
                )}
              </FormControl>
            </Box>
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
          form="user-form"
        >
          {user && user.id ? "Update User" : "Add User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditUserModal;
