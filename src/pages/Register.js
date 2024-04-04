import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { FormControl } from "@mui/base/FormControl";

import { useAuth } from "../context/authContext/index";
import { authCreateUser } from "../firebase/auth";

const Register = () => {
  const { isLoggedIn } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const registerMutation = useMutation(authCreateUser);

  const onSubmit = (data) => {
    if (!registerMutation.isLoading) {
      registerMutation.mutate(data);
    }
  };

  if (isLoggedIn) {
    return <Navigate to={"/home"} replace={true} />;
  }

  return (
    <>
      <Box>
        <Typography variant="h6">Create a New Account</Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <TextField
              label="Email"
              type="email"
              {...register("email", { required: true })}
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email && "Email is required"}
              required
            />
          </Box>

          <Box>
            <TextField
              label="Password"
              type="password"
              {...register("password", { required: true })}
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password && "Password is required"}
              required
            />
          </Box>

          <Box>
            <TextField
              label="Confirm Password"
              type="password"
              {...register("confirmPassword", {
                required: true,
                validate: (value) =>
                  value === password || "The passwords do not match",
              })}
              autoComplete="off"
              error={!!errors.confirmPassword}
              helperText={
                errors.confirmPassword && errors.confirmPassword.message
              }
              required
            />
          </Box>

          {registerMutation.isError && (
            <Alert severity="error">{registerMutation.error.message}</Alert>
          )}

          <Button
            type="submit"
            disabled={registerMutation.isLoading}
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: registerMutation.isLoading ? "grey.300" : "indigo.600",
              "&:hover": {
                bgcolor: registerMutation.isLoading ? "grey.300" : "indigo.700",
              },
            }}
          >
            {registerMutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign Up"
            )}
          </Button>

          <Box>
            Already have an account? <Link to="/login">Sign In</Link>
          </Box>
        </FormControl>
      </Box>
    </>
  );
};

export default Register;
