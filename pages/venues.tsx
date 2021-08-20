import ErrorPage from "@/components/ErrorPage";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import VenueCard from "@/components/VenueCard";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const VenueQuery = gql`
  query VenueQuery {
    venues {
      id
      name
      description
      logoRef
      websiteUrl
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
        <div className="mt-3">
          <VenueCard venue={venue} />
        </div>
      ))}
    </Layout>
  );
}

export default withApollo(Venues);
