import { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import UserPopover from "@/components/UserPopover";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";

const ArticlesQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  query SubmissionsQuery($where: SubmissionWhereInput!) {
    submissions(where: $where) {
      id
      createdAt
      owner {
        id
        name
      }
      article {
        ...ArticleCardFields
      }
      reviewRequests {
        user {
          ...UserCardFields
        }
        submission {
          venue {
            id
            name
          }
        }
      }
    }
  }
`;

function FlexBox({ children }) {
  return <Box sx={{ display: "flex", width: "100%" }}>{children}</Box>;
}

export default function UserDetailsCard({ user, onAssign }) {
  const { profilePictureUrl, name } = user;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLeave = () => {
    setAnchorEl(null);
  };
  return (
    <FlexBox>
      <Accordion sx={{ flex: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            sx={{ flex: 1 }}
          >
            {name}
          </Typography>
          <UserPopover user={user} anchorEl={anchorEl} />
        </AccordionSummary>
        <AccordionDetails>Test</AccordionDetails>
      </Accordion>
      <Button size="small">Assign</Button>
    </FlexBox>
  );
}
