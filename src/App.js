import Header from "./features/Header/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/authContext";
import { useRoutes } from "react-router";
import { CssBaseline } from "@mui/material";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
  ];
  let routesElement = useRoutes(routesArray);

  return (
    <AuthProvider>
      <CssBaseline />

      <Header />
      {routesElement}
    </AuthProvider>
  );
}

export default App;
