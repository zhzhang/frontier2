import ErrorPage from "@/components/ErrorPage";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import VenueCard from "@/components/VenueCard";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
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
      <Box sx={{ maxWidth: 1000 }}>
        <Input
          fullWidth
          disabled
          sx={{ mb: 2 }}
          placeholder="Venue search coming soon!"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: 1 }}>
            <Button>Following</Button>
            <Button>Accepting Review Requests</Button>
          </Box>
          <Button href="/new-venue">Create New Venue</Button>
        </Box>
        {data.venues.map((venue) => (
          <Box sx={{ mt: 2 }} key={venue.id}>
            <VenueCard venue={venue} />
          </Box>
        ))}
      </Box>
    </Layout>
  );
}

export default withApollo(Venues);
