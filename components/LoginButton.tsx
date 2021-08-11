import { Auth } from "@/components/Auth";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { useState } from "react";

export default function LoginButton() {
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
}
