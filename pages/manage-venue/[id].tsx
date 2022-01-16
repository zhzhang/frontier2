import ErrorPage from "@/components/ErrorPage";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import InfoPane from "@/components/manage-venue/InfoPane";
import MembersPane from "@/components/manage-venue/MembersPane";
import SubmissionsPane from "@/components/manage-venue/SubmissionsPane";
import { VENUE_CARD_FIELDS } from "@/components/VenueCard";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";

const VenueQuery = gql`
  ${VENUE_CARD_FIELDS}
  query VenueQuery($id: String!) {
    venue(id: $id) {
      ...VenueCardFields
      role
    }
  }
`;

function Header({ name, logoRef }) {
  return (
    <Box
      sx={{
        m: 1,
        display: "flex",
      }}
    >
      <FirebaseAvatar
        storeRef={logoRef}
        variant="rounded"
        name={name}
        sx={{ width: "64px", height: "64px" }}
      />
      <Typography variant="h6" sx={{ ml: 1 }}>
        {name}
      </Typography>
    </Box>
  );
}

function Venue() {
  const router = useRouter();
  const id = router.query.id;
  const view = router.query.view ? router.query.view : "info";
  const { loading, error, data } = useQuery(VenueQuery, {
    variables: { id },
  });

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <ErrorPage>Error loading this venue.</ErrorPage>;
  }

  const { name, logoRef } = data.venue;

  const handleChange = (_, newValue) => {
    router.query.view = newValue;
    router.push(router, undefined, { shallow: true });
  };

  const sx = {
    p: 0,
    pt: 2,
  };

  return (
    <Layout>
      <TabContext value={view}>
        <Drawer
          variant="permanent"
          sx={{
            width: 300,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 300,
              boxSizing: "border-box",
            },
          }}
        >
          <Box
            sx={{
              marginTop: "48px",
            }}
          >
            <Header name={name} logoRef={logoRef} />
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              orientation="vertical"
            >
              <Tab label="Venue Info" value="info" />
              <Tab label="Review Settings" value="review-settings" />
              <Tab label="Submissions" value="submissions" />
              <Tab label="Members" value="members" />
            </TabList>
          </Box>
        </Drawer>
        <Box sx={{ marginLeft: "300px" }}>
          <TabPanel value="info" sx={sx}>
            <InfoPane venue={data.venue} />
          </TabPanel>
          <TabPanel value="review-settings" sx={sx}>
            <InfoPane venue={data.venue} />
          </TabPanel>
          <TabPanel value="submissions" sx={sx}>
            <SubmissionsPane id={id} />
          </TabPanel>
          <TabPanel value="members" sx={sx}>
            <MembersPane id={id} />
          </TabPanel>
        </Box>
      </TabContext>
    </Layout>
  );
}

export default withApollo(Venue);
