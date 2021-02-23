import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Router from "next/router";
import Row from "react-bootstrap/Row";

const Home = () => {
  return (
    <Container style={{ paddingTop: 100 }} fluid>
      <Row className="justify-content-md-center">
        <h1>Welcome to Frontier.pub</h1>
      </Row>
      <Row className="justify-content-md-center">
        <h4>Academic Review - Redesigned</h4>
      </Row>
      <Row className="justify-content-md-center">
        <Button
          onClick={() => Router.push("/article/cklgwx4zu000058v2vz52cajm")}
          variant="secondary"
        >
          View Demo
        </Button>
      </Row>
    </Container>
  );
};

export default Home;
