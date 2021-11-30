import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import katex from "katex";
import "katex/dist/katex.min.css";
import Navigation from "./Navigation";

const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

export default function Layout({ children, padded = true }) {
  if (typeof window !== "undefined") {
    window.katex = katex;
  }
  const sx = {
    marginTop: "48px",
    p: 0,
  };
  if (padded) {
    sx.p = 2;
  }

  return (
    <>
      <link
        rel="stylesheet"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />

      <Navigation />
      <Box sx={sx}>{children}</Box>
    </>
  );
}
