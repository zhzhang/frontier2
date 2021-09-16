import { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import Spinner from "@/components/CenteredSpinner";
import Layout from "@/components/Layout";
import ReviewRequestCard from "@/components/review-requests/ReviewRequestCard";
import SubmissionCard from "@/components/review-requests/SubmissionCard";
import { USER_CHIP_FIELDS } from "@/components/UserChip";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";

const SubmissionsQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  ${USER_CHIP_FIELDS}
  query SubmissionsQuery($where: SubmissionWhereInput!) {
    submissions(where: $where) {
      id
      article {
        ...ArticleCardFields
      }
      reviewRequests {
        user {
          ...UserChipFields
        }
      }
    }
  }
`;

const RequestsQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  query RequestsQuery($where: ReviewRequestWhereInput!) {
    reviewRequests(where: $where) {
      id
      article {
        ...ArticleCardFields
      }
      submission {
        id
        venue {
          id
          name
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
  },
  editButton: {
    marginLeft: "auto",
  },
  avatar: {
    height: theme.spacing(10),
    width: theme.spacing(10),
    marginRight: theme.spacing(2),
  },
}));

function Submissions({ id }) {
  const { loading, error, data } = useQuery(SubmissionsQuery, {
    variables: { where: { owner: { id: { equals: id } } } },
  });
  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      {data.submissions.map((submission) => (
        <SubmissionCard submission={submission} />
      ))}
    </>
  );
}

function ReviewRequests({ id }) {
  const { loading, error, data } = useQuery(RequestsQuery, {
    variables: { where: { user: { id: { equals: id } } } },
  });
  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      {data.reviewRequests.map((request) => (
        <ReviewRequestCard request={request} />
      ))}
    </>
  );
}

function Root() {
  const classes = useStyles();
  const router = useRouter();
  const id = router.query.id;

  const tabKey = "articles";

  return (
    <Layout>
      <Typography variant="h4">Meta-Review Requests</Typography>
      <Submissions id={id} />
      <Typography variant="h4">Review Requests</Typography>
      <ReviewRequests id={id} />
    </Layout>
  );
}

export default withApollo(Root);
