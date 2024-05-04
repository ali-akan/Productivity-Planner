// Login.jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Box,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { authSignInWith, authSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../context/authContext";
import Register from "./Register"; // Import the Register component

const Login = () => {
  const { isLoggedIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  const signInMutation = useMutation(authSignInWith, {
    onError: (error) => {
      console.error("Error signing in:", error);
    },
  });

  const googleSignInMutation = useMutation(authSignInWithGoogle, {
    onError: (error) => {
      console.error("Error signing in with Google:", error);
    },
  });

  const onSubmit = (data) => {
    const { email, password } = data;
    signInMutation.mutate({ email, password });
  };

  const onGoogleSignIn = (e) => {
    e.preventDefault();
    googleSignInMutation.mutate().catch((err) => {
      console.error("Error signing in with Google:", err);
    });
  };

  const handleRegister = () => {
    setOpenRegisterModal(true);
  };

  const handleCloseRegisterModal = () => {
    setOpenRegisterModal(false);
    reset(); // Reset the form when the modal is closed
  };

  if (isLoggedIn) {
    return <Navigate to={"/home"} replace={true} />;
  }

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid item xs={12} sm={8}>
        {/* Left side: Image */}
        <Grid
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",

            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
          }}
        ></Grid>
      </Grid>
      <Grid item xs={12} sm={4}>
        {/* Right side: Form */}
        <Grid
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 2, // Add padding to the form container
            height: "100%",
          }}
        >
          <FormControl
            sx={{
              // height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              // maxHeight: "100vw"
            }}
          >
            <TextField
              label="Email"
              type="email"
              {...register("email", { required: true })}
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email && "Email is required"}
              required
            />
            <TextField
              label="Password"
              type="password"
              {...register("password", { required: true })}
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password && "Password is required"}
              required
            />
            {signInMutation.isError && (
              <Alert severity="error">{signInMutation.error.message}</Alert>
            )}
            {googleSignInMutation.isError && (
              <Alert severity="error">
                {googleSignInMutation.error.message}
              </Alert>
            )}
            <Button
              type="submit"
              disabled={signInMutation.isLoading}
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              {signInMutation.isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Don't have an account?
              <Button variant="text" onClick={handleRegister}>
                Sign Up
              </Button>
            </Typography>
            <Button
              disabled={googleSignInMutation.isLoading}
              onClick={onGoogleSignIn}
              variant="outlined"
              sx={{ mt: 2 }}
            >
              {googleSignInMutation.isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Continue with Google"
              )}
            </Button>
          </FormControl>
        </Grid>
      </Grid>
      {/* Register Modal */}
      <Dialog
        open={openRegisterModal}
        onClose={handleCloseRegisterModal}
        fullWidth
      >
        <Box
          sx={{
            bgcolor: "secondary.main",
          }}
        >
          <DialogTitle>Register</DialogTitle>
          <DialogContent>
            <Register
              onSubmit={handleSubmit(onSubmit)}
              signInMutation={signInMutation}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRegisterModal}>Cancel</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Grid>
  );
};

export default Login;
