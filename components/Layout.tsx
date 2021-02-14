import Navigation from "./Navigation";
import Container from "react-bootstrap/Container";
import "react-quill/dist/quill.snow.css";

const Layout = (props) => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
        crossOrigin="anonymous"
      />
      <Navigation />
      <Container fluid className="mt-5">
        {props.children}
      </Container>
    </>
  );
};

export default Layout;
