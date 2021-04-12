import Navigation from "./Navigation";
import Container from "react-bootstrap/Container";
import katex from "katex";
import "katex/dist/katex.min.css";

const Layout = (props) => {
  if (typeof window !== "undefined") {
    window.katex = katex;
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
        href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css"
      />

      <Navigation />
      <div style={{ paddingTop: 55 }}>{props.children}</div>
    </>
  );
};

export default Layout;
