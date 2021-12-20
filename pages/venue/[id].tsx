import ErrorPage from "@/components/ErrorPage";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import ArticlesPane from "@/components/venue/ArticlesPane";
import InfoPane from "@/components/venue/InfoPane";
import VenueDatesBar from "@/components/VenueDatesBar";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";

const VenueQuery = gql`
  query VenueQuery($where: VenueWhereUniqueInput!) {
    venue(where: $where) {
      id
      name
      description
      websiteUrl
      logoRef
      role
      venueDate
      submissionOpen
      submissionDeadline
    }
  }
`;

function Venue() {
  const router = useRouter();
  const id = router.query.id;
  const { loading, error, data } = useQuery(VenueQuery, {
    variables: { where: { id } },
  });

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <ErrorPage>Error loading this venue.</ErrorPage>;
  }

  const { name, logoRef, role } = data.venue;

  return (
    <Layout>
      <Box sx={{ display: "flex" }}>
        <Box>
          <FirebaseAvatar
            storeRef={logoRef}
            variant="rounded"
            name={name}
            sx={{
              width: "3.5rem",
              height: "3.5rem",
              mr: 2,
            }}
          />
        </Box>
        <Box>
          <Typography variant="h5">{name}</Typography>
          <VenueDatesBar venue={data.venue} />
        </Box>
        {role && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push(`/manage-venue/${id}`)}
            sx={{
              marginLeft: "auto",
              height: 36,
            }}
          >
            Manage
          </Button>
        )}
      </Box>
      <InfoPane venue={data.venue} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Articles
      </Typography>
      <ArticlesPane id={id} />
    </Layout>
  );
}

export default withApollo(Venue);
