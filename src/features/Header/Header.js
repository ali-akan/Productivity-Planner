import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/authContext";
import { useMutation } from "react-query";
import { authSignOut } from "../../firebase/auth";
import { Button } from "@mui/material";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const { mutate: signOut, isLoading: isSignOutLoading } = useMutation(
    authSignOut,
    {
      onSuccess: () => {
        navigate("/login");
      },
    }
  );

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      {isLoggedIn && (
        <Button
          onClick={handleSignOut}
          variant="outlined"
          disabled={isSignOutLoading}
        >
          {isSignOutLoading ? "Logging out..." : "Logout"}
        </Button>
      )}
    </>
  );
};

export default Header;
