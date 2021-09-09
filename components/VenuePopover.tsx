import FirebaseAvatar from "@/components/FirebaseAvatar";
import Link from "@material-ui/core/Link";
import Popover from "@material-ui/core/Popover";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Router from "next/router";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      pointerEvents: "none",
    },
    paper: {
      padding: theme.spacing(2),
      maxWidth: 600,
    },
    header: {
      display: "flex",
    },
    typography: {
      marginLeft: theme.spacing(2),
      paddingTop: 6,
    },
  })
);

export default function VenuePopover({
  venue,
  color = "textSecondary",
  variant = "span",
}) {
  const { id, name, abbreviation, description, venueDate, logoRef } = venue;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLeave = () => {
    setAnchorEl(null);
  };

  const parsedVenueDate = new Date(venueDate);
  let abbrev = abbreviation;
  if (venueDate) {
    abbrev += ` ${parsedVenueDate.getFullYear()}`;
  }

  return (
    <>
      <Typography
        color="textSecondary"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        color={color}
        variant={variant}
        onClick={() => Router.push(`/venue/${id}`)}
      >
        <Link href={`/venue/${id}`} color="inherit">
          {abbrev}
        </Link>
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
          <FirebaseAvatar variant="rounded" name={name} storeRef={logoRef} />
          <Typography variant="h6" className={classes.typography}>
            {name}
          </Typography>
        </div>
        {description}
      </Popover>
    </>
  );
}
