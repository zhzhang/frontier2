import Authors from "@/components/Authors";
import Markdown from "@/components/Markdown";
import VenuePopover from "@/components/VenuePopover";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";
import { USER_CARD_FIELDS } from "./UserCard";
import { VENUE_CARD_FIELDS } from "./VenueCard";

export const ARTICLE_CARD_FIELDS = gql`
  ${VENUE_CARD_FIELDS}
  ${USER_CARD_FIELDS}
  fragment ArticleCardFields on Article {
    id
    title
    abstract
    authors {
      ...UserCardFields
    }
    latestVersion {
      ref
      createdAt
    }
    acceptedVenues {
      ...VenueCardFields
    }
  }
`;

function AcceptedVenues({ venues, ...props }) {
  if (venues.length === 0) {
    return null;
  }
  const children = [<Typography component="span">Accepted by: </Typography>];
  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i];
    children.push(<VenuePopover venue={venue} key={venue.id} {...props} />);
    if (i < venues.length - 1) {
      children.push(<>, </>);
    }
  }
  return <Box>{children}</Box>;
}

export default function ArticleCard({ article, sx = null }) {
  const { id, title, abstract, authors, acceptedVenues } = article;
  const [showAbstract, setShowAbstract] = useState(false);

  return (
    <Box sx={sx}>
      <Link underline="hover" variant="h6" href={`/article/${id}`}>
        {title}
      </Link>
      <Authors authors={authors} />
      <Button
        size="small"
        sx={{ padding: 0 }}
        onClick={() => setShowAbstract(!showAbstract)}
      >
        {showAbstract ? "Hide Abstract" : "Show Abstract"}
      </Button>
      {showAbstract && <Markdown>{abstract}</Markdown>}
      <AcceptedVenues venues={acceptedVenues} />
    </Box>
  );
}
