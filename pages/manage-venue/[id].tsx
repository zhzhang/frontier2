import ErrorPage from "@/components/ErrorPage";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import InfoPane from "@/components/manage-venue/InfoPane";
import MembersPane from "@/components/manage-venue/MembersPane";
import SubmissionsPane from "@/components/manage-venue/SubmissionsPane";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";

const VenueQuery = gql`
  query VenueQuery($where: VenueWhereUniqueInput!) {
    venue(where: $where) {
      id
      name
      abbreviation
      description
      venueDate
      role
      logoRef
      acceptingSubmissions
    }
  }
`;

function Header({ name, logoRef }) {
  return (
    <Box
      sx={{
        display: "flex",
        "& > *": {
          m: 1,
        },
      }}
    >
      <FirebaseAvatar storeRef={logoRef} variant="rounded" name={name} />
      <Typography variant="h4">{name}</Typography>
    </Box>
  );
}

const TABS = [
  { name: "Venue Info", key: "info" },
  { name: "Submissions", key: "submissions" },
  { name: "Members", key: "members" },
];

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

  const { name, logoRef } = data.venue;
  const handleSelectTab = (key) => () => {
    router.query.view = key;
    router.push(router, undefined, { shallow: true });
  };

  let renderedView;
  switch (view) {
    case "info":
      renderedView = <InfoPane venue={data.venue} />;
      break;
    case "submissions":
      renderedView = <SubmissionsPane id={id} />;
      break;
    case "members":
      renderedView = <MembersPane id={id} />;
      break;
  }

  return (
    <Layout>
      <Header name={name} logoRef={logoRef} />
      <Grid container>
        <Grid item xs={2}>
          <List sx={{ mr: 1 }}>
            {TABS.map(({ name, key }) => (
              <ListItem
                button
                selected={view === key}
                key={key}
                onClick={handleSelectTab(key)}
              >
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid
          item
          container
          xs={10}
          spacing={2}
          sx={{
            overflowY: "scroll",
            height: "100%",
          }}
        >
          {renderedView}
        </Grid>
      </Grid>
    </Layout>
  );
}

export default withApollo(Venue);
