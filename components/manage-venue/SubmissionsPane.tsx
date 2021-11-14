import { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import { useQuery } from "@apollo/react-hooks";
import { Grid } from "@material-ui/core";
import gql from "graphql-tag";
import { USER_CHIP_FIELDS } from "../UserChip";
import SubmissionCard from "./SubmissionCard";

const SubmissionsQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  ${USER_CHIP_FIELDS}
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
          ...UserChipFields
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
    <Grid item>
      {submissions.map((submission) => (
        <SubmissionCard
          key={submission.id}
          submission={submission}
          venueId={id}
        />
      ))}
    </Grid>
  );
};

export default SubmissionsPane;