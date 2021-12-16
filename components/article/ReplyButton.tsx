import { Auth } from "@/components/Auth";
import { useAuth } from "@/lib/firebase";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import { threadRepliesVar } from "./vars";

export default function ReplyButton({ headId }) {
  const auth = useAuth();
  const [loginOpen, toggleLoginOpen] = useState(false);
  return (
    <>
      <Button
        size="small"
        sx={{ p: 0, minWidth: 0 }}
        onClick={() => {
          if (auth.user) {
            const threadReplies = threadRepliesVar();
            threadRepliesVar(
              threadReplies.set(headId, {
                body: "",
                highlights: [],
              })
            );
          } else {
            toggleLoginOpen(true);
          }
        }}
      >
        Reply
      </Button>
      <Dialog
        open={loginOpen && !auth.user}
        onClose={() => toggleLoginOpen(false)}
      >
        <Auth />
      </Dialog>
    </>
  );
}
