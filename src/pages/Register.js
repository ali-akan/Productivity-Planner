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
} from "@mui/material";
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
  const password = React.useRef({});
  password.current = watch("password", "");

  const registerMutation = useMutation(authCreateUser);

  const onSubmit = async (data) => {
    if (!registerMutation.isLoading) {
      try {
        await registerMutation.mutateAsync(data);
      } catch (error) {
        console.error("Registration error:", error);
      }
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <Navigate to={"/home"} replace={true} />
      ) : (
        <main>
          <div>
            <div>
              <div>
                <Typography variant="h6">Create a New Account</Typography>
              </div>
            </div>
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
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password && "Password is required"}
                  required
                />
              </div>

              <div>
                <TextField
                  label="Confirm Password"
                  type="password"
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) =>
                      value === password.current ||
                      "The passwords do not match",
                  })}
                  autoComplete="off"
                  error={!!errors.confirmPassword}
                  helperText={
                    errors.confirmPassword && errors.confirmPassword.message
                  }
                  required
                />
              </div>

              {/* Display error message */}
              {registerMutation.isError && (
                <Alert severity="error">{registerMutation.error.message}</Alert>
              )}

              <Button
                type="submit"
                disabled={registerMutation.isLoading}
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: registerMutation.isLoading
                    ? "grey.300"
                    : "indigo.600",
                  "&:hover": {
                    bgcolor: registerMutation.isLoading
                      ? "grey.300"
                      : "indigo.700",
                  },
                }}
              >
                {registerMutation.isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign Up"
                )}
              </Button>

              <div>
                Already have an account? <Link to="/login">Sign In</Link>
              </div>
            </form>
          </div>
        </main>
      )}
    </>
  );
};

export default Register;
