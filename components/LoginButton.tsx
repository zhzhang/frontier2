import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { useState } from "react";
import { Auth } from "../components/Auth";

const LoginButton = () => {
  const [open, toggleOpen] = useState(false);
  return (
    <>
      <Button color="inherit" onClick={() => toggleOpen(true)}>
        Login
      </Button>
      <Dialog open={open} onClose={() => toggleOpen(false)}>
        <Auth />
      </Dialog>
    </>
  );
};

export default LoginButton;
