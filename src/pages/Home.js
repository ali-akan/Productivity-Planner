import { useAuth } from "../context/authContext";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

const Home = () => {
  const { userInfo } = useAuth();
  return (
    <Box>
      <Typography>
        Hello {userInfo.displayName ? userInfo.displayName : userInfo.email},
        you are now logged in.
      </Typography>
    </Box>
  );
};

export default Home;
