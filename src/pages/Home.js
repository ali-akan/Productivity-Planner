import { useAuth } from "../context/authContext";
import Typography from "@mui/material/Typography";

const Home = () => {
  const { userInfo } = useAuth();
  const displayName = userInfo?.displayName;
  const email = userInfo?.email;

  return (
    <Typography>
      {userInfo ? (
        <>Hello {displayName || email}, you are now logged in.</>
      ) : (
        "Loading..."
      )}
    </Typography>
  );
};

export default Home;
