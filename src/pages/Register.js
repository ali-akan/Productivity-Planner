import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext/index";
import { useMutation } from "react-query"; // Import QueryClient and QueryClientProvider
import { authCreateUser } from "../firebase/auth";

const Register = () => {
  const { userLoggedIn } = useAuth();

  const registerMutation = useMutation(authCreateUser);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
  
    if (!registerMutation.isLoading) {
      try {
        await registerMutation.mutateAsync({ email, password }); // Pass email and password as an object
      } catch (error) {
        // Handle error
      }
    }
  };
  
  
  

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}
      <main>
        <div>
          <div>
            <div>
              <h3>Create a New Account</h3>
            </div>
          </div>
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
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="off"
                required
              />
            </div>

            {/* Display error message */}
            {registerMutation.isError && (
              <span>{registerMutation.error.message}</span>
            )}

            <button
              type="submit"
              disabled={registerMutation.isLoading}
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                registerMutation.isLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
              }`}
            >
              {registerMutation.isLoading ? "Signing Up..." : "Sign Up"}
            </button>
            <div>
              Already have an account? {"   "}
              <Link to={"/login"}>Continue</Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;