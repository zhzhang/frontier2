import FirebaseAvatar from "@/components/FirebaseAvatar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Router from "next/router";
import { useState } from "react";

export default function VenuePopover({
  venue,
  color = "textSecondary",
  variant = "span",
}) {
  const { id, name, abbreviation, description, venueDate, logoRef } = venue;
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
        sx={{
          pointerEvents: "none",

          padding: 2,
          maxWidth: 600,
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
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex" }}>
            <FirebaseAvatar variant="rounded" name={name} storeRef={logoRef} />
            <Typography
              variant="h6"
              sx={{
                marginLeft: 2,
              }}
            >
              {name}
            </Typography>
          </Box>
          {description}
        </Box>
      </Popover>
    </>
  );
}
