import { useAuth } from "../context/authContext";
import Typography from "@mui/material/Typography";
import Write from "../features/FireBase/Write";
import Read from "../features/FireBase/Read";

const Home = () => {
  const { userInfo } = useAuth();
  const displayName = userInfo?.displayName;
  const email = userInfo?.email;
  const loginMessage = userInfo
    ? `Hello ${displayName || email}, you are now logged in.`
    : "Loading...";

  return (
    <Typography>
      <div>{loginMessage}</div>
      <Write />
      <Read />
    </Typography>
  );
};

export default Home;
