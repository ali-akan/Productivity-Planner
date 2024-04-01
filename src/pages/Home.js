import { useAuth } from "../context/authContext";
import Typography from "@mui/material/Typography";

const Home = () => {
  const { userInfo } = useAuth();
  const displayName = userInfo?.displayName;
  const email = userInfo?.email;
  const loginMessage = userInfo
    ? `Hello ${displayName || email}, you are now logged in.`
    : "Loading...";

  return <Typography>{loginMessage}</Typography>;
};

export default Home;
