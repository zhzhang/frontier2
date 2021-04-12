import LoginButton from "./LoginButton";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { auth, useAuth } from "../lib/firebase";

const Navigation = () => {
  const { user, loading } = useAuth();
  return (
    <Navbar bg="dark" variant="dark" fixed="top">
      <Navbar.Brand href="#home">Frontier</Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/articles">Articles</Nav.Link>
          <Nav.Link href="/organizations">Organizations</Nav.Link>
        </Nav>
        {/* {!loading && user !== null && user !== undefined ? (
          <Nav className="justify-content-end">
            <NavDropdown title="Profile" id="basic-nav-dropdown">
              <NavDropdown.Item
                href="#action/3.1"
                onSelect={() =>
                  auth()
                    .signOut()
                    .then(() => location.reload())
                }
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        ) : (
          <LoginButton />
        )} */}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
