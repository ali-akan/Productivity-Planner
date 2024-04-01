import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
  FormControl,
} from "@mui/material";
import { authSignInWith, authSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../context/authContext";

const Login = () => {
  const { isLoggedIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  if (isLoggedIn) {
    return <Navigate to={"/home"} replace={true} />;
  }

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
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
            <Alert severity="error">{googleSignInMutation.error.message}</Alert>
          )}
          <Button
            type="submit"
            disabled={signInMutation.isLoading}
            variant="contained"
            sx={{
              mt: 2,
            }}
          >
            {signInMutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
        </FormControl>
      </Box>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </Typography>
      <Button
        disabled={googleSignInMutation.isLoading}
        onClick={onGoogleSignIn}
        variant="outlined"
        sx={{
          mt: 2,
        }}
      >
        {googleSignInMutation.isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Continue with Google"
        )}
      </Button>
    </>
  );
};

export default Login;
