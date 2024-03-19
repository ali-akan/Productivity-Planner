import { useNavigate } from "react-router";
import { useAuth } from "../../context/authContext";
import { authSignOut } from "../../firebase/auth";
import { Link } from "react-router-dom";
import React from "react";

// import Box from "@mui/material/Box";
// import BottomNavigation from "@mui/material/BottomNavigation";
// import BottomNavigationAction from "@mui/material/BottomNavigationAction";

const Header = () => {
  // const [value, setValue] = React.useState(0);

  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  return (
    <nav>
      {isLoggedIn ? (
        <div>
          <button
            onClick={() => {
              authSignOut().then(() => {
                navigate("/login");
              });
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <Link to={"/login"}>Login</Link>
          <Link to={"/register"}>Register New Account</Link>

          {/* <Box>
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            >
              <BottomNavigationAction
                label="Login"
                component={Link}
                to="/login"
              />
              <BottomNavigationAction
                label="Register"
                component={Link}
                to="/register"
              />
            </BottomNavigation>
          </Box> */}
        </div>
      )}
    </nav>
  );
};

export default Header;
