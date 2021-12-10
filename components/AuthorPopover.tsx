import Link from "@mui/material/Link";
import { useState } from "react";
import UserPopover from "./UserPopover";

export default function AuthorPopover({ user, color = "textSecondary" }) {
  const [anchorEl, setAnchorEl] = useState(null);
  console.log(user);
  const { id, name } = user;
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
        href={`/user/${id}`}
        underline="hover"
        color={color}
        variant="body1"
      >
        {name}
      </Link>
      <UserPopover user={user} anchorEl={anchorEl} />
    </>
  );
}
