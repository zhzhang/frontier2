import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Auth } from "../components/Auth";

const LoginButton = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setShowModal(true)}>
        Log In
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>Log In</Modal.Header>
        <Modal.Body>
          <Auth />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginButton;
