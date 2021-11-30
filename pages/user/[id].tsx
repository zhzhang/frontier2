import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import {
  default as CenteredSpinner,
  default as Spinner,
} from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Layout from "@/components/Layout";
import Review, { REVIEW_CARD_FIELDS } from "@/components/Review";
import { USER_CARD_FIELDS } from "@/components/UserCard";
import { withApollo } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { useQuery } from "@apollo/react-hooks";
import BusinessIcon from "@mui/icons-material/Business";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

const AuthorshipsQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  query AuthorshipsQuery($where: AuthorshipWhereInput!) {
    authorships(where: $where) {
      article {
        ...ArticleCardFields
      }
    }
  }
`;

function ArticlesTab({ userId }) {
  const { loading, error, data } = useQuery(AuthorshipsQuery, {
    variables: { where: { userId: { equals: userId } } },
  });
  if (loading) {
    return <CenteredSpinner />;
  }
  if (error) {
    return <Error>{error.message}</Error>;
  }
  if (data.authorships.length === 0) {
    return <Typography>This user has no public articles.</Typography>;
  }
  return (
    <>
      {data.authorships.map((authorship) => {
        const { article } = authorship;
        return (
          <ArticleCard article={article} key={article.id} sx={{ mb: 1 }} />
        );
      })}
    </>
  );
}

const ReviewsQuery = gql`
  ${REVIEW_CARD_FIELDS}
  query ReviewsQuery($where: ReviewWhereInput!) {
    reviews(where: $where) {
      ...ReviewCardFields
    }
  }
`;

function ReviewsTab({ userId }) {
  const { loading, error, data } = useQuery(ReviewsQuery, {
    variables: { where: { authorId: { equals: userId } } },
  });
  if (loading) {
    return <CenteredSpinner />;
  }
  if (error) {
    return <Error>{error.message}</Error>;
  }
  if (data.reviews.length === 0) {
    return <Typography>This user has no public reviews.</Typography>;
  }
  return (
    <>
      {data.review.map((review) => {
        return (
          <Review review key={review.id} sx={{ mb: 1 }} renderThread={false} />
        );
      })}
    </>
  );
}

const UserQuery = gql`
  ${USER_CARD_FIELDS}
  query UserQuery($where: UserWhereUniqueInput!) {
    user(where: $where) {
      ...UserCardFields
    }
  }
`;

const TABS = [
  { name: "Articles", key: "articles" },
  { name: "Reviews", key: "reviews" },
];

function User() {
  const router = useRouter();
  const auth = useAuth();
  const id = router.query.id;
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { where: { id } },
  });
  const [tab, setTab] = useState("articles");
  const handleChange = (_, newValue: number) => {
    setTab(newValue);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { name, profilePictureUrl, institution, twitter, website } = data.user;
  const iconSx = { fontSize: "1.2rem", verticalAlign: "middle", mr: 0.3 };
  const contentSx = { p: 0 };

  return (
    <Layout>
      <TabContext value={tab}>
        <Grid container spacing={3}>
          <Grid item sm={3} spacing={3} justifyContent="center">
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <FirebaseAvatar
                sx={{
                  height: "14rem",
                  width: "14rem",
                  mt: 2,
                }}
                storeRef={profilePictureUrl}
                name={name}
              />
            </Box>
            <Typography align="center" variant="h5" sx={{ mt: 4 }}>
              {name}
            </Typography>
            {institution && (
              <Typography sx={{ mt: 1 }}>
                <BusinessIcon sx={iconSx} />
                {institution}
              </Typography>
            )}
            {website && (
              <Box sx={{ mt: 1 }}>
                <OpenInNewIcon sx={iconSx} />
                <Link variant="body1">{website}</Link>
              </Box>
            )}
            {id === auth.user.uid && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => router.push("/edit-profile")}
                sx={{ mt: 1, p: 0 }}
                fullWidth
                size="small"
              >
                Edit Profile
              </Button>
            )}
            <List>
              {TABS.map(({ name, key }) => (
                <ListItem
                  button
                  selected={tab === key}
                  key={key}
                  onClick={() => setTab(key)}
                >
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item sm={9}>
            <TabPanel value="articles" index={0} sx={contentSx}>
              <ArticlesTab userId={id} />
            </TabPanel>
            <TabPanel value="reviews" index={1} sx={contentSx}>
              <ReviewsTab userId={id} />
            </TabPanel>
          </Grid>
        </Grid>
      </TabContext>
    </Layout>
  );
}

export default withApollo(User);
