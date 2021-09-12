import Error from "@/components/Error";
import { useQuery } from "@apollo/react-hooks";
import { Grid } from "@material-ui/core";
import gql from "graphql-tag";
import Spinner from "react-bootstrap/Spinner";
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
    return <Spinner animation="border" style={{ top: "50%", left: "50%" }} />;
  } else if (error) {
    return (
      <Grid container item sm={10} spacing={2}>
        <Grid item>
          <Error>
            There was a problem retrieving this organization's submissions.
          </Error>
        </Grid>
      </Grid>
    );
  }
  const submissions = data.submissions;
  return (
    <Grid container item sm={10} spacing={2}>
      <Grid item>
        {submissions.length === 0
          ? "There are currently no submissions."
          : submissions.map((submission) => (
              <SubmissionCard submission={submission} organizationId={id} />
            ))}
      </Grid>
    </Grid>
  );
};

export default SubmissionsPane;
