import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import VenueCard from "@/components/VenueCard";
import { useQuery } from "@apollo/react-hooks";
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

export default function VenuesPane({ id }) {
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
      {venues.map((venue) => (
        <VenueCard venue={venue} />
      ))}
      <h4>Past Venues</h4>
      {venues
        .filter((venue) => Date.parse(venue.date) < Date.now())
        .map((venue) => (
          <VenueCard venue={venue} />
        ))}
    </>
  );
}
