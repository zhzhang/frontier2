import FirebaseAvatar from "@/components/FirebaseAvatar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export default function AuthorPopover({ user, color = "textSecondary" }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { id, name, profilePictureUrl } = user;
  const anonymized = id === "anonymous";
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
        component="span"
        color={color}
        variant="body1"
      >
        {name}
      </Link>
      <Popover
        id={id}
        sx={{
          pointerEvents: "none",
        }}
        open={Boolean(anchorEl) && !anonymized}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        disableRestoreFocus
      >
        <Box
          sx={{
            display: "flex",
            p: 1,
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
    </>
  );
}
