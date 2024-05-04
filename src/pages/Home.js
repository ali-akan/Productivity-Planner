import MyCalendar from "../components/FullCalendar/MyCalendar";
import { useAuth } from "../context/authContext";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

const Home = () => {
  const { userInfo } = useAuth();
  const displayName = userInfo?.displayName;
  const email = userInfo?.email;
  const loginMessage = userInfo
    ? `Hello ${displayName || email}, you are now logged in.`
    : "Loading...";

  return (
    <>
      <Typography>{loginMessage}</Typography>
      <Box>
        <MyCalendar />
      </Box>
    </>
  );
};

export default Home;
