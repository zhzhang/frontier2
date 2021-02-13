import Navigation from "./Navigation";
import Container from "react-bootstrap/Container";

const Layout = (props) => {
  if (typeof window === "undefined") {
    return <div>Loading ...</div>;
  }
  return (
    <>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
        crossorigin="anonymous"
      />
      <Navigation />
      <Container>{props.children}</Container>
    </>
  );
};

export default Layout;
