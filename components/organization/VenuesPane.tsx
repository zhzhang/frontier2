import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import VenueCard from "@/components/VenueCard";
import { useQuery } from "@apollo/react-hooks";
import { makeStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";

const VenuesQuery = gql`
  query VenuesQuery($where: VenueWhereInput!) {
    venues(where: $where) {
      id
      name
      abbreviation
      venueDate
      description
      submissionDeadline
    }
  }
`;

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    margin: theme.spacing(1),
  },
}));

export default function VenuesPane({ id }) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(VenuesQuery, {
    variables: { where: { organizationId: { equals: id } } },
  });
  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return (
      <Error>There was a problem retrieving this organization's venues.</Error>
    );
  }
  const { venues } = data;
  return (
    <>
      <div className={classes.container}>
        {venues.map((venue) => (
          <VenueCard venue={venue} />
        ))}
      </div>
      <div className={classes.container}>
        <Typography variant="h4">Past Venues</Typography>
        {venues
          .filter((venue) => Date.parse(venue.date) < Date.now())
          .map((venue) => (
            <VenueCard venue={venue} />
          ))}
      </div>
    </>
  );
}
