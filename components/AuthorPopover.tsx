import Link from "@mui/material/Link";
import { useState } from "react";
import UserPopover from "./UserPopover";

export default function AuthorPopover({ author, color = "textSecondary" }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const anonymous = !Boolean(author);
  const { id, name } = author;
  const handleEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLeave = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Link
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        href={anonymous ? undefined : `/user/${id}`}
        underline={anonymous ? "none" : "hover"}
        color={color}
        variant="body1"
      >
        {name}
      </Link>
      {author !== "anonymous" && (
        <UserPopover user={author} anchorEl={anchorEl} />
      )}
    </>
  );
}
