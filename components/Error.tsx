import MuiAlert from "@material-ui/lab/Alert";
import { useState } from "react";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Error = ({ children, dismissible = true }) => {
  const [show, setShow] = useState(true);
  if (show) {
    return <Alert severity="error">{children}</Alert>;
  }
  return null;
};

export default Error;
