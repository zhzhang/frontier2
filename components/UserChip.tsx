import FirebaseAvatar from "@/components/FirebaseAvatar";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import Router from "next/router";
import { useState } from "react";

export const USER_CHIP_FIELDS = gql`
  fragment UserChipFields on User {
    id
    name
    profilePictureUrl
    email
    twitter
    website
    institution
  }
`;

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
      <Popover
        id={id}
        sx={{
          pointerEvents: "none",
        }}
        open={Boolean(anchorEl)}
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
            p: 1,
          }}
        >
          <FirebaseAvatar name={name} storeRef={profilePictureUrl} />
          <Typography variant="h6">{name}</Typography>
        </Box>
      </Popover>
    </Box>
  );
}
