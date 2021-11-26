import FirebaseAvatar from "@/components/FirebaseAvatar";
import Popover from "@mui/material/Popover";
import { createStyles, makeStyles, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import Router from "next/router";
import { useState } from "react";

export const USER_CHIP_FIELDS = gql`
  fragment UserChipFields on User {
    id
    name
    profilePictureUrl
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      display: "flex",
      alignItems: "center",
    },
    avatar: {
      width: 30,
      height: 30,
      marginRight: theme.spacing(0.5),
    },
    popover: {
      pointerEvents: "none",
    },
    paper: {
      padding: theme.spacing(1),
    },
    header: {
      display: "flex",
    },
  })
);

export default function UserChip({ user, canInteract = true }) {
  const classes = useStyles();
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
    <div
      className={classes.chip}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      <FirebaseAvatar
        storeRef={profilePictureUrl}
        name={name}
        className={classes.avatar}
      />
      <Typography>{name}</Typography>
      <Popover
        id={id}
        className={classes.popover}
        classes={{
          paper: classes.paper,
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
        <div className={classes.header}>
          <FirebaseAvatar name={name} storeRef={profilePictureUrl} />
          <Typography variant="h6" className={classes.typography}>
            {name}
          </Typography>
        </div>
      </Popover>
    </div>
  );
}
