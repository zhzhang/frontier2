import FirebaseAvatar from "@/components/FirebaseAvatar";
import Popover from "@mui/material/Popover";
import Router from "next/router";
import { useState } from "react";

export default function ProfilePicturePopover({ user, sx = null }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { id, name, profilePictureUrl } = user;
  const anonymous = id === "anonymous";
  const handleEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLeave = () => {
    setAnchorEl(null);
  };
  const handleClick = () => {
    if (!anonymous) {
      Router.push(`/user/${id}`);
    }
  };
  return (
    <>
      <FirebaseAvatar
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        storeRef={profilePictureUrl}
        anonymous={anonymous}
        name={name}
        sx={sx}
      />
      <Popover
        id={id}
        sx={{
          pointerEvents: "none",
        }}
        open={Boolean(anchorEl) && !anonymous}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        disableRestoreFocus
      ></Popover>
    </>
  );
}
