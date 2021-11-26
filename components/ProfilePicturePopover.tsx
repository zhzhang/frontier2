import FirebaseAvatar from "@/components/FirebaseAvatar";
import Popover from "@mui/material/Popover";
import { createStyles, makeStyles, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Router from "next/router";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
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

export default function ProfilePicturePopover({ user }) {
  const classes = useStyles();
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
      <div
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <FirebaseAvatar
          storeRef={profilePictureUrl}
          anonymous={anonymous}
          name={name}
        />
      </div>
      <Popover
        id={id}
        className={classes.popover}
        classes={{
          paper: classes.paper,
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
      >
        <div className={classes.header}>
          <FirebaseAvatar name={name} storeRef={profilePictureUrl} />
          <Typography variant="h6" className={classes.typography}>
            {name}
          </Typography>
        </div>
      </Popover>
    </>
  );
}
