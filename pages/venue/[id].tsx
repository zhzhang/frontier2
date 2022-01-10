import ErrorPage from "@/components/ErrorPage";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import ArticlesPane from "@/components/venue/ArticlesPane";
import InfoPane from "@/components/venue/InfoPane";
import { VENUE_CARD_FIELDS } from "@/components/VenueCard";
import VenueDatesBar from "@/components/VenueDatesBar";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";

const VenueQuery = gql`
  ${VENUE_CARD_FIELDS}
  query VenueQuery($where: VenueWhereUniqueInput!) {
    venue(where: $where) {
      ...VenueCardFields
      role
    }
  }
`;

function Venue() {
  const router = useRouter();
  const id = router.query.id;
  const { loading, error, data } = useQuery(VenueQuery, {
    variables: { where: { id } },
  });
  console.log(data);

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
      <TabContext value={"1"}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
          <TabList onChange={() => {}} aria-label="lab API tabs example">
            <Tab label="Articles" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 0 }}>
          <ArticlesPane id={id} />
        </TabPanel>
      </TabContext>
    </Layout>
  );
}

export default withApollo(Venue);
