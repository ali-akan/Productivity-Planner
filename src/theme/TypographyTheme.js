import * as React from "react";
import { styled } from "@mui/material/styles";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

export default function TypographyTheme(props) {
  return <Div>{props.children}</Div>;
}
