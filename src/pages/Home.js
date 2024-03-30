import { useAuth } from "../context/authContext";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

const Home = () => {
  const { userInfo } = useAuth();
  const displayName = userInfo?.displayName || userInfo?.email || "Loading...";

  return (
    <Box>
      <Typography>
        Hello {displayName}, you are now logged in.
      </Typography>
    </Box>
  );
};

export default Home;
