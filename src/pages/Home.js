import { useAuth } from "../context/authContext";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

const Home = () => {
  const { userInfo } = useAuth();

  return (
    <Box>
      <Typography>
        {userInfo ? (
          <span>
            Hello {userInfo.displayName ? userInfo.displayName : userInfo.email}
            , you are now logged in.
          </span>
        ) : (
          "Loading..."
        )}
      </Typography>
    </Box>
  );
};

export default Home;
