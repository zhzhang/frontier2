import FirebaseAvatar from "@/components/FirebaseAvatar";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Router from "next/router";
import { useState } from "react";

export default function AuthorPopover({
  user,
  color = "textSecondary",
  variant = "span",
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { id, name, profilePictureUrl } = user;
  const anonymized = id === "anonymous";
  const handleEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLeave = () => {
    setAnchorEl(null);
  };
  const handleClick = () => {
    if (!anonymized) {
      Router.push(`/user/${id}`);
    }
  };
  return (
    <span
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      <Typography
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        color={color}
        variant={variant}
      >
        {name}
      </Typography>
      <Popover
        id={id}
        sx={{
          pointerEvents: "none",
          p: 1,
        }}
        open={Boolean(anchorEl) && !anonymized}
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
      >
        <Box
          sx={{
            display: "flex",
          }}
        >
          <FirebaseAvatar name={name} storeRef={profilePictureUrl} />
          <Typography
            variant="h6"
            sx={{
              p: 1,
            }}
          >
            {name}
          </Typography>
        </Box>
      </Popover>
    </span>
  );
}
