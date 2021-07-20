import FirebaseAvatar from "@/components/FirebaseAvatar";
import Popover from "@material-ui/core/Popover";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
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

export default function AuthorPopover({ user }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { id, name, email, profilePictureUrl } = user;
  const handleEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLeave = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Typography
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        color="textSecondary"
        onClick={() => Router.push(`/user/${id}`)}
      >
        {name}
      </Typography>
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
    </>
  );
}
