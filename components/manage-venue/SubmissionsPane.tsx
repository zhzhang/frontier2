import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import { USER_CARD_FIELDS } from "@/components/UserCard";
import { useQuery } from "@apollo/react-hooks";
import { Grid } from "@mui/material";
import gql from "graphql-tag";

const SubmissionsQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  ${USER_CARD_FIELDS}
  query SubmissionsQuery($where: SubmissionWhereInput!) {
    submissions(where: $where) {
      id
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

const SubmissionsPane = ({ id }) => {
  const { loading, error, data } = useQuery(SubmissionsQuery, {
    variables: { where: { venueId: { equals: id } } },
  });
  if (loading) {
    return <Spinner />;
  } else if (error) {
    return (
      <Grid item>
        <Error>
          There was a problem retrieving this organization's submissions.
        </Error>
      </Grid>
    );
  }
  const submissions = data.submissions;
  if (submissions.length === 0) {
    return <Grid item>There are currently no submissions.</Grid>;
  }
  return (
    <Grid item container spacing={3}>
      <Grid item sm={6}>
        {submissions.map((submission) => (
          <ArticleCard key={submission.id} article={submission.article} />
        ))}
      </Grid>
      <Grid item sm={6}>
        Temp
      </Grid>
    </Grid>
  );
};

export default SubmissionsPane;
