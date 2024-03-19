import { useAuth } from "../context/authContext";
import { Box } from "@mui/material";

const Home = () => {
  const { userToken } = useAuth();
  return (
    <Box>
      <div>
        Hello {userToken.displayName ? userToken.displayName : userToken.email},
        you are now logged in.
      </div>
    </Box>
  );
};

export default Home;
