import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/authContext";
import { useMutation } from "react-query";
import { authSignOut } from "../../firebase/auth";
import { Button, Box } from "@mui/material";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const { mutate: signOut } = useMutation(authSignOut, {
    onSuccess: () => {
      navigate("/login");
    },
  });

  const handleSignOut = () => {
    signOut();
  };

  return (
    <Box>
      {isLoggedIn ? (
        <Box>
          <Button
            onClick={handleSignOut}
            variant="outlined"
            disabled={signOut.isLoading}
          >
            {signOut.isLoading ? "Logging out..." : "Logout"}
          </Button>
        </Box>
      ) : (
        <Box>
          <Button component={Link} to={"/login"} variant="outlined">
            Login
          </Button>
          <Button component={Link} to={"/register"} variant="outlined">
            Register New Account
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Header;
