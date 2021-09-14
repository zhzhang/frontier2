import ErrorPage from "@/components/ErrorPage";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import InfoPane from "@/components/manage-venue/InfoPane";
import MembersPane from "@/components/manage-venue/MembersPane";
import SubmissionsPane from "@/components/manage-venue/SubmissionsPane";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    logo: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    nav: {
      marginRight: theme.spacing(1),
    },
    body: {
      overflowY: "scroll",
      height: "100%",
    },
  })
);

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
    }
  }
`;

function Header({ name, logoRef }) {
  const classes = useStyles();
  return (
    <div className={classes.header}>
      <FirebaseAvatar storeRef={logoRef} variant="rounded" name={name} />
      <Typography variant="h5">{name}</Typography>
    </div>
  );
}

const TABS = [
  { name: "Submissions", key: "submissions" },
  { name: "Members", key: "members" },
  { name: "Venue Info", key: "info" },
];

function Venue() {
  const classes = useStyles();
  const router = useRouter();
  const id = router.query.id;
  const view = router.query.view ? router.query.view : "submissions";
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
          <List className={classes.nav}>
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
        <Grid item container xs={10} spacing={2} className={classes.body}>
          {renderedView}
        </Grid>
      </Grid>
    </Layout>
  );
}

export default withApollo(Venue);
