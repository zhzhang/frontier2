import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import {
  default as CenteredSpinner,
  default as Spinner,
} from "@/components/CenteredSpinner";
import ClippedDrawer from "@/components/ClippedDrawer";
import Error from "@/components/Error";
import ErrorPage from "@/components/ErrorPage";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Layout from "@/components/Layout";
import Review from "@/components/Review";
import { THREAD_MESSAGE_FIELDS } from "@/components/Thread";
import EditProfile from "@/components/user/EditProfile";
import { USER_CARD_FIELDS } from "@/components/UserCard";
import { withApollo } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { useQuery } from "@apollo/react-hooks";
import BusinessIcon from "@mui/icons-material/Business";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TwitterIcon from "@mui/icons-material/Twitter";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import normalizeUrl from "normalize-url";

const ArticlesQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  query ArticlesQuery($input: UserArticlesInput!) {
    userArticles(input: $input) {
      ...ArticleCardFields
    }
  }
`;

function ArticlesTab({ userId }) {
  const { loading, error, data } = useQuery(ArticlesQuery, {
    variables: {
      input: {
        userId,
      },
    },
  });
  if (loading) {
    return <CenteredSpinner />;
  }
  if (error) {
    return <Error>{error.message}</Error>;
  }
  if (data.userArticles.length === 0) {
    return <Typography>This user has no public articles.</Typography>;
  }
  return (
    <>
      {data.userArticles.map((article) => {
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
  query ReviewsQuery($input: UserReviewsInput!) {
    userReviews(input: $input) {
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
      input: {
        userId,
      },
    },
  });
  if (loading) {
    return <CenteredSpinner />;
  }
  if (error) {
    return <Error>{error.message}</Error>;
  }
  if (data.userReviews.length === 0) {
    return <Typography>This user has no public reviews.</Typography>;
  }
  return (
    <>
      {data.userReviews.map((review) => {
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
  console.log(data);

  const isUser = !auth.loading && auth.user && auth.user.uid === id;

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <ErrorPage>Error loading the user profile.</ErrorPage>;
  }

  const { name, profilePictureUrl, institution, twitter, website } = data.user;
  const iconSx = { fontSize: "1.2rem", verticalAlign: "middle", mr: 0.3 };
  const contentSx = { p: 0 };
  const handleSelectTab = (_, newValue) => {
    router.query.view = newValue;
    router.push(router, undefined, { shallow: true });
  };

  return (
    <Layout>
      <TabContext value={view}>
        <ClippedDrawer
          drawer={
            <>
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
              <Box sx={{ m: 2 }}>
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
                {twitter && (
                  <Box sx={{ mt: 1 }}>
                    <TwitterIcon sx={iconSx} />
                    <Link
                      variant="body1"
                      href={normalizeUrl(`https://twitter.com/${twitter}`)}
                    >
                      {twitter}
                    </Link>
                  </Box>
                )}
              </Box>
              <TabList onChange={handleSelectTab} orientation="vertical">
                <Tab label="Articles" value="articles" />
                <Tab label="Reviews" value="reviews" />
                {isUser && <Divider />}
                {isUser && <Tab label="Edit Profile" value="edit" />}
                {isUser && <Tab label="Relations" value="relations" />}
                {isUser && <Tab label="Review Requests" value="requests" />}
              </TabList>
            </>
          }
        >
          <TabPanel value="articles" sx={contentSx}>
            <ArticlesTab userId={id} />
          </TabPanel>
          <TabPanel value="reviews" sx={contentSx}>
            <ReviewsTab userId={id} />
          </TabPanel>
          <TabPanel value="edit" sx={contentSx}>
            <EditProfile user={data.user} />
          </TabPanel>
        </ClippedDrawer>
      </TabContext>
    </Layout>
  );
}

export default withApollo(User);
