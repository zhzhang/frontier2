import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import { USER_CARD_FIELDS } from "@/components/UserCard";
import { VENUE_CARD_FIELDS } from "@/components/VenueCard";
import VenuePopover from "@/components/VenuePopover";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import _ from "lodash";
import { useState } from "react";

export const REVIEW_REQUEST_CARD_FIELDS = gql`
  ${ARTICLE_CARD_FIELDS}
  ${USER_CARD_FIELDS}
  ${VENUE_CARD_FIELDS}
  fragment ReviewRequestCardFields on ReviewRequest {
    id
    type
    user {
      ...UserCardFields
    }
    article {
      ...ArticleCardFields
    }
    venue {
      ...VenueCardFields
    }
  }
`;

export default function ReviewRequestCard({
  reviewRequest,
  selectedRequest,
  setSelectedRequest,
}) {
  let style = {
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    m: "1px",
    p: 1,
    mb: 1,
    borderColor: null,
  };
  const [hover, setHover] = useState(false);
  const selected = selectedRequest && selectedRequest.id === reviewRequest.id;
  if (selected || hover) {
    style.border = "2px solid rgba(0, 0, 0, 0.23)";
    style.m = 0;
    style.borderColor = "primary.main";
  }
  if (selected) {
    style.borderColor = "primary.main";
  } else if (hover) {
    style.borderColor = "black";
  }
  const { article, type, venue } = reviewRequest;
  return (
    <Box
      sx={style}
      onClick={() => setSelectedRequest(reviewRequest)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ArticleCard article={article} />
      <Divider sx={{ mt: 0.5, mb: 0.5 }} />
      <Typography component="span">{_.capitalize(type)} for </Typography>
      <VenuePopover venue={venue} />
    </Box>
  );
}
