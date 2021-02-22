import { useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

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
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginButton;
