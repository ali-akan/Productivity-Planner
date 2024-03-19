import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useMutation } from "react-query";
import { authSignInWith, authSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../context/authContext";

const Login = () => {
  const { userLoggedIn } = useAuth();

  const signInMutation = useMutation(authSignInWith);
  const googleSignInMutation = useMutation(authSignInWithGoogle);

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
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
    <div>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}
      <div>
        <form onSubmit={onSubmit}>
          <div>
            <label>Email</label>
            <input type="email" name="email" autoComplete="email" required />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </div>
          {signInMutation.isError && (
            <span>{signInMutation.error.message}</span>
          )}
          <button
            type="submit"
            disabled={signInMutation.isLoading}
            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
              signInMutation.isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
            }`}
          >
            {signInMutation.isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p>
          Don't Have an account?
          <Link to={"/register"}>Sign Up</Link>
        </p>
        <button
          disabled={googleSignInMutation.isLoading}
          onClick={onGoogleSignIn}
          className={`w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium  ${
            googleSignInMutation.isLoading
              ? "cursor-not-allowed"
              : "hover:bg-gray-100 transition duration-300 active:bg-gray-100"
          }`}
        >
          {googleSignInMutation.isLoading
            ? "Signing In..."
            : "Continue with Google"}
        </button>
      </div>
    </div>
  );
};

export default Login;
