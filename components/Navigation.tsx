import LoginButton from "./LoginButton";
import Navbar from "react-bootstrap/Navbar";

const Navigation = () => {
  return (
    <Navbar bg="light" fixed="top">
      <Navbar.Brand href="#home">Frontier</Navbar.Brand>
      <LoginButton />
    </Navbar>
  );
};

export default Navigation;
