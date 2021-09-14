import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import { useQuery } from "@apollo/react-hooks";
import { Grid } from "@material-ui/core";
import gql from "graphql-tag";
import SubmissionCard from "./SubmissionCard";

const SubmissionsQuery = gql`
  query SubmissionsQuery($where: SubmissionWhereInput!) {
    submissions(where: $where) {
      id
      owner {
        id
        name
        email
      }
      article {
        id
        title
        versions {
          abstract
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
        <SubmissionCard submission={submission} organizationId={id} />
      ))}
    </Grid>
  );
};

export default SubmissionsPane;
