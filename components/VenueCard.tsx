import FirebaseAvatar from "@/components/FirebaseAvatar";
import VenueDatesBar from "@/components/VenueDatesBar";
import { formatVenueAbbreviation } from "@/lib/utils";
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
    logoRef
    submissionDeadline
    acceptingSubmissions
  }
`;

export default function VenueCard({ venue }) {
  const { id, name, abbreviation, logoRef, venueDate } = venue;
  const logoSx = {
    height: "4rem",
    width: "4rem",
  };

  const Header = () => {
    const parsedVenueDate = new Date(venueDate);
    let abbrev = formatVenueAbbreviation(venue);
    if (abbrev) {
      abbrev += " - ";
    }
    return (
      <Typography variant="h6" color="textSecondary">
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
            {name[0]}
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
