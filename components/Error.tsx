import { useState } from "react";
import Alert from "react-bootstrap/Alert";

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
        <p>Please refresh and try again.</p>
      </Alert>
    );
  }
  return null;
};

export default Error;
