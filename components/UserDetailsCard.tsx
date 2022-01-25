import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import Error from "@/components/Error";
import UserPopover from "@/components/UserPopover";
import { useQuery } from "@apollo/client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";

const ArticlesQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  query ArticlesQuery($input: UserArticlesInput!) {
    userArticles(input: $input) {
      ...ArticleCardFields
    }
  }
`;

function Articles({ userId }) {
  const { loading, error, data } = useQuery(ArticlesQuery, {
    variables: {
      input: {
        userId,
      },
    },
  });
  if (loading) {
    return <Skeleton variant="text" />;
  }
  if (error) {
    return <Error>Unable to load this user's articles.</Error>;
  }
  const { userArticles } = data;
  return (
    <>
      {userArticles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </>
  );
}

function FlexBox({ children }) {
  return <Box sx={{ display: "flex", width: "100%" }}>{children}</Box>;
}

export default function UserDetailsCard({ user, onRequest }) {
  const { id, profilePictureUrl, name } = user;
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
          <Typography onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            {name}
          </Typography>
          <UserPopover user={user} anchorEl={anchorEl} />
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6">Recent Articles</Typography>
          <Articles userId={user.id} />
        </AccordionDetails>
      </Accordion>
      <Button size="small" onClick={() => onRequest(id)}>
        Request
      </Button>
    </FlexBox>
  );
}
