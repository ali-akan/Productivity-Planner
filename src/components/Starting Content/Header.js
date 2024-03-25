import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/authContext";
import { authSignOut } from "../../firebase/auth";
import { Button } from "@mui/material";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <nav>
      {isLoggedIn ? (
        <div>
          <Button
            onClick={() => {
              authSignOut().then(() => {
                navigate("/login");
              });
            }}
            variant="outlined"
          >
            Logout
          </Button>
        </div>
      ) : (
        <div>
          <Button component={Link} to={"/login"} variant="outlined">
            Login
          </Button>
          <Button component={Link} to={"/register"} variant="outlined">
            Register New Account
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Header;
