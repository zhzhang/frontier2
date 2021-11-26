import Box from "@mui/material/Box";
import katex from "katex";
import "katex/dist/katex.min.css";
import Navigation from "./Navigation";

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
      <Navigation />
      <Box sx={sx}>{children}</Box>
    </>
  );
}
