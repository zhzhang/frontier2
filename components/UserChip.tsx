import FirebaseAvatar from "@/components/FirebaseAvatar";
import UserPopover from "@/components/UserPopover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Router from "next/router";
import { useState } from "react";

export default function UserChip({ user, canInteract = true, ...props }) {
  const { id, name, profilePictureUrl } = user;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleEnter = (event) => {
    canInteract && setAnchorEl(event.currentTarget);
  };
  const handleLeave = () => {
    canInteract && setAnchorEl(null);
  };
  const handleClick = () => {
    canInteract && Router.push(`/user/${id}`);
  };
  return (
    <Box
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "center",
      }}
      {...props}
    >
      <FirebaseAvatar
        storeRef={profilePictureUrl}
        name={name}
        sx={{
          width: 30,
          height: 30,
          marginRight: 0.5,
        }}
      />
      <Typography>{name}</Typography>
      <UserPopover user={user} anchorEl={anchorEl} />
    </Box>
  );
}
