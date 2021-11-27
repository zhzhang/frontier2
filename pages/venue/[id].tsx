import ErrorPage from "@/components/ErrorPage";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import ArticlesPane from "@/components/venue/ArticlesPane";
import InfoPane from "@/components/venue/InfoPane";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
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
  const view = router.query.view ? router.query.view : "info";
  const { loading, error, data } = useQuery(VenueQuery, {
    variables: { where: { id } },
  });

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <ErrorPage>Error loading this venue.</ErrorPage>;
  }

  const { name, description, role, logoRef } = data.venue;
  const getTab = () => {
    switch (view) {
      case "articles":
        return {
          body: <ArticlesPane id={id} />,
          tab: 1,
        };
      default:
        return {
          body: <InfoPane venue={data.venue} />,
          tab: 0,
        };
    }
  };
  const { tab, body } = getTab();

  return (
    <Layout>
      <Box sx={{ display: "flex" }}>
        <FirebaseAvatar
          storeRef={logoRef}
          variant="rounded"
          name={name}
          sx={{
            w: 7,
            h: 7,
            mr: 2,
          }}
        />
        <Typography variant="h5">{name}</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => router.push(`/manage-venue/${id}`)}
          sx={{
            marginLeft: "auto",
          }}
        >
          Manage
        </Button>
      </Box>
      <Tabs
        value={tab}
        indicatorColor="primary"
        textColor="primary"
        onChange={(event, newIndex) => {
          let newTabKey = "info";
          if (newIndex === 1) {
            newTabKey = "articles";
          }
          router.query.view = newTabKey;
          router.push(router, undefined, { shallow: true });
        }}
      >
        <Tab label="info" />
        <Tab label="articles" />
      </Tabs>
      {body}
    </Layout>
  );
}

export default withApollo(Venue);
