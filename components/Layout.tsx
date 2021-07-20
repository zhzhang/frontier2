import { makeStyles } from "@material-ui/core/styles";
import katex from "katex";
import "katex/dist/katex.min.css";
import Navigation from "./Navigation";

const useStyles = makeStyles((theme) => ({
  padded: {
    marginTop: "48px",
    padding: theme.spacing(2),
  },
}));

const Layout = ({ children, padded = true }) => {
  const classes = useStyles();
  if (typeof window !== "undefined") {
    window.katex = katex;
  }
  const body = padded ? (
    <div className={classes.padded}>{children}</div>
  ) : (
    children
  );
  return (
    <>
      <link
        rel="stylesheet"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css"
      />

      <Navigation />
      {body}
    </>
  );
};

export default Layout;
