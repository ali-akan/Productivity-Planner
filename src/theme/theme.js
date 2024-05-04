import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#ffffd2",
    },
    secondary: {
      main: "#fcbad3",
    },
    background: {
      default: "#aa96da",
      paper: "#ffffd2",
    },
    text: {
      primary: "#000000",
      secondary: "#FFFFD2",
    },
  },
  typography: {
    fontFamily: "Do Hyeon",
    
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;
