import gql from "graphql-tag";
import Container from "react-bootstrap/Container";
import AcceptedArticleCard from "../AcceptedArticleCard";
import Error from "../Error";
import VenueCard from "../VenueCard";
import Spinner from "react-bootstrap/Spinner";
import { useQuery, useMutation } from "@apollo/react-hooks";

const OrganizationQuery = gql`
  query OrganizationQuery($id: String!) {
    organization(id: $id) {
      id
      venues {
        id
        name
        abbreviation
        date
      }
    }
  }
`;

export default ({ id }) => {
  const { loading, error, data } = useQuery(OrganizationQuery, {
    variables: { id },
  });
  if (loading) {
    return <Spinner animation="border" style={{ top: "50%", left: "50%" }} />;
  }
  if (error) {
    return (
      <Container fluid style={{ paddingTop: 10 }}>
        <Error header="There was a problem retrieving this organization's venues." />
      </Container>
    );
  }
  const { venues } = data.organization;
  return (
    <Container fluid style={{ paddingTop: 10 }}>
      <h4>Past Venues</h4>
      {venues
        .filter((venue) => Date.parse(venue.date) < Date.now())
        .map((venue) => (
          <VenueCard venue={venue} />
        ))}
    </Container>
  );
};