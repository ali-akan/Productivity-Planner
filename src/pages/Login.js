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

  const signInMutation = useMutation(authSignInWith);
  const googleSignInMutation = useMutation(authSignInWithGoogle);

  const onSubmit = async (data) => {
    const { email, password } = data;
    if (!signInMutation.isLoading) {
      try {
        await signInMutation.mutateAsync({ email, password });
      } catch (error) {
        console.error("Error signing in:", error);
      }
    }
  };

  const onGoogleSignIn = (e) => {
    e.preventDefault();
    if (!googleSignInMutation.isLoading) {
      googleSignInMutation.mutate().catch((err) => {
        console.error("Error signing in with Google:", err);
      });
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <Navigate to={"/home"} replace={true} />
      ) : (
        <div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <TextField
                  label="Email"
                  type="email"
                  {...register("email", { required: true })}
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email && "Email is required"}
                  required
                />
              </div>
              <div>
                <TextField
                  label="Password"
                  type="password"
                  {...register("password", { required: true })}
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password && "Password is required"}
                  required
                />
              </div>
              {signInMutation.isError && (
                <Alert severity="error">{signInMutation.error.message}</Alert>
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
            </form>
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
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
