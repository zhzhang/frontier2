import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import {
  default as CenteredSpinner,
  default as Spinner,
} from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import ErrorPage from "@/components/ErrorPage";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Layout from "@/components/Layout";
import Review from "@/components/Review";
import { THREAD_MESSAGE_FIELDS } from "@/components/Thread";
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
import normalizeUrl from "normalize-url";

const AuthorshipsQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  query AuthorshipsQuery($where: IdentityWhereInput!) {
    identities(where: $where) {
      article {
        ...ArticleCardFields
      }
    }
  }
`;

function ArticlesTab({ userId }) {
  const { loading, error, data } = useQuery(AuthorshipsQuery, {
    variables: {
      where: {
        AND: [
          { userId: { equals: userId } },
          { context: { equals: "AUTHOR" } },
        ],
      },
    },
  });
  if (loading) {
    return <CenteredSpinner />;
  }
  if (error) {
    return <Error>{error.message}</Error>;
  }
  if (data.identities.length === 0) {
    return <Typography>This user has no public articles.</Typography>;
  }
  return (
    <>
      {data.identities.map((authorship) => {
        const { article } = authorship;
        return (
          <ArticleCard article={article} key={article.id} sx={{ mb: 1 }} />
        );
      })}
    </>
  );
}

const ReviewsQuery = gql`
  ${THREAD_MESSAGE_FIELDS}
  ${ARTICLE_CARD_FIELDS}
  query ReviewsQuery($where: ThreadMessageWhereInput!) {
    threadMessages(where: $where) {
      ...ThreadMessageFields
      article {
        ...ArticleCardFields
      }
    }
  }
`;

function ReviewsTab({ userId }) {
  const { loading, error, data } = useQuery(ReviewsQuery, {
    variables: {
      where: {
        AND: [{ authorId: { equals: userId } }, { type: { equals: "REVIEW" } }],
      },
    },
  });
  if (loading) {
    return <CenteredSpinner />;
  }
  if (error) {
    return <Error>{error.message}</Error>;
  }
  if (data.threadMessages.length === 0) {
    return <Typography>This user has no public reviews.</Typography>;
  }
  return (
    <>
      {data.threadMessages.map((review) => {
        return (
          <>
            <Review
              review={review}
              key={review.id}
              sx={{ mb: 1 }}
              renderThread={false}
            />
            <ArticleCard article={review.article} />
          </>
        );
      })}
    </>
  );
}

const UserQuery = gql`
  ${USER_CARD_FIELDS}
  query UserQuery($id: String!) {
    user(id: $id) {
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
  const view = router.query.view ? router.query.view : "articles";
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { id },
  });

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <ErrorPage>Error loading the user profile.</ErrorPage>;
  }

  const { name, profilePictureUrl, institution, twitter, website } = data.user;
  const iconSx = { fontSize: "1.2rem", verticalAlign: "middle", mr: 0.3 };
  const contentSx = { p: 0 };
  const handleSelectTab = (key) => {
    router.query.view = key;
    router.push(router, undefined, { shallow: true });
  };

  return (
    <Layout>
      <TabContext value={view}>
        <Grid container spacing={3}>
          <Grid item sm={2.5} justifyContent="center">
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
                <Link variant="body1" href={normalizeUrl(website)}>
                  {website}
                </Link>
              </Box>
            )}
            {id === auth.user?.uid && (
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
                  selected={view === key}
                  key={key}
                  onClick={() => handleSelectTab(key)}
                >
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item sm={9.5}>
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
