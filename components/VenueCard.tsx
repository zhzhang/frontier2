import FirebaseAvatar from "@/components/FirebaseAvatar";
import VenueDatesBar from "@/components/VenueDatesBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";

export const VENUE_CARD_FIELDS = gql`
  fragment VenueCardFields on Venue {
    id
    name
    abbreviation
    description
    websiteUrl
    logoRef
    venueDate
  }
`;

export default function VenueCard({ venue }) {
  const { id, name, abbreviation, logoRef, venueDate } = venue;
  const logoSx = {
    height: "3.5rem",
    width: "3.5rem",
  };

  const Header = () => {
    const parsedVenueDate = new Date(venueDate);
    let abbrev = abbreviation;
    if (venueDate) {
      abbrev += ` ${parsedVenueDate.getFullYear()}`;
    }
    abbrev += " - ";
    return (
      <Typography variant="h5" color="textSecondary">
        <Link href={`/venue/${id}`} color="inherit" underline="none">
          {abbrev}
          {name}
        </Link>
      </Typography>
    );
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          "& > *": {
            m: 1,
          },
        }}
      >
        {logoRef === null ? (
          <Avatar sx={logoSx} variant="rounded">
            T
          </Avatar>
        ) : (
          <FirebaseAvatar
            sx={logoSx}
            storeRef={logoRef}
            variant="rounded"
            name={name}
          />
        )}
        <div>
          <Header />
          <VenueDatesBar venue={venue} />
        </div>
      </Box>
    </>
  );
}
