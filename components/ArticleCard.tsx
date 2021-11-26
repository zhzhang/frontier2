import Authors from "@/components/Authors";
import Markdown from "@/components/Markdown";
import VenuePopover from "@/components/VenuePopover";
import Box from "@mui/material/Box";
import gql from "graphql-tag";

export const ARTICLE_CARD_FIELDS = gql`
  fragment ArticleCardFields on Article {
    id
    title
    authors {
      id
      name
    }
    versions {
      abstract
      ref
      createdAt
    }
    acceptedVenues {
      id
      name
      abbreviation
      description
      logoRef
      venueDate
    }
  }
`;

function AcceptedVenues({ venues, ...props }) {
  if (venues.length === 0) {
    return null;
  }
  const children = ["Accepted by: "];
  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i];
    children.push(<VenuePopover venue={venue} key={venue.id} {...props} />);
    if (i < venues.length - 1) {
      children.push(", ");
    }
  }
  return <div>{children}</div>;
}

export default function ArticleCard({ article, sx = null }) {
  const { id, title, versions, authors, acceptedVenues } = article;

  return (
    <Box sx={sx}>
      <a href={`/article/${id}`}>{title}</a>
      <Authors authors={authors} />
      <Markdown>{versions[0].abstract}</Markdown>
      <AcceptedVenues venues={acceptedVenues} />
    </Box>
  );
}
