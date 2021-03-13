import Alert from "react-bootstrap/Alert";
import { useState } from "react";

const Error = ({ header, dismissible = true }) => {
  const [show, setShow] = useState(true);
  if (show) {
    return (
      <Alert
        variant="danger"
        onClose={() => setShow(false)}
        dismissible={dismissible}
      >
        <Alert.Heading>{header}</Alert.Heading>
        <p>
          Please refresh and try again. If the problem persists, please contact
          the support team for assistance.
        </p>
      </Alert>
    );
  }
  return null;
};

export default Error;
