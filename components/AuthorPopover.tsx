import { userFromIdentity } from "@/lib/utils";
import Link from "@mui/material/Link";
import { useState } from "react";
import UserPopover from "./UserPopover";

export default function AuthorPopover({ identity, color = "textSecondary" }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const anonymous = !Boolean(identity.user);
  const user = userFromIdentity(identity);
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
        href={!anonymous && `/user/${id}`}
        underline={anonymous ? "none" : "hover"}
        color={color}
        variant="body1"
      >
        {name}
      </Link>
      <UserPopover user={identity} anchorEl={anchorEl} />
    </>
  );
}
