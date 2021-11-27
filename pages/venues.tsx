import ErrorPage from "@/components/ErrorPage";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import VenueCard from "@/components/VenueCard";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import gql from "graphql-tag";

const VenueQuery = gql`
  query VenueQuery {
    venues {
      id
      name
      abbreviation
      description
      logoRef
      websiteUrl
      venueDate
      submissionDeadline
      submissionOpen
    }
  }
`;

function Venues() {
  const { loading, error, data } = useQuery(VenueQuery);

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }
  if (error) {
    return (
      <ErrorPage>Unable to load venues, please try again later.</ErrorPage>
    );
  }

  return (
    <Layout>
      {data.venues.map((venue) => (
        <Box sx={{ mt: 2 }}>
          <VenueCard venue={venue} />
        </Box>
      ))}
    </Layout>
  );
}

export default withApollo(Venues);
