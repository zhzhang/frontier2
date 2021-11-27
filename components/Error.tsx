import Alert from "@mui/material/Alert";
import { useState } from "react";

export default function Error({ children, ...props }) {
  const [show, setShow] = useState(true);
  if (show) {
    return (
      <Alert severity="error" {...props}>
        {children}
      </Alert>
    );
  }
  return null;
}
