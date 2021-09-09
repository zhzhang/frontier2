import ErrorPage from "@/components/ErrorPage";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import InfoPane from "@/components/manage-organization/InfoPane";
import { useQuery } from "@apollo/react-hooks";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { withApollo } from "../../lib/apollo";
import { useRef } from "../../lib/firebase";

const useStyles = makeStyles((theme) =>
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
    headerItem: {
      marginRight: theme.spacing(2),
    },
  })
);

const VenueQuery = gql`
  query VenueQuery($where: VenueWhereUniqueInput!) {
    venue(where: $where) {
      id
      name
      description
      role
      logoRef
    }
  }
`;

function Header({ name, logoRef }) {
  const classes = useStyles();
  const url = useRef(logoRef);
  return (
    <div className={classes.header}>
      <FirebaseAvatar storeRef={logoRef} variant="rounded" name={name} />
      <Typography variant="h5">{name}</Typography>
    </div>
  );
}

const TABS = [
  { name: "Info", key: "info" },
  { name: "Submissions", key: "submissions" },
  { name: "Action Editors", key: "editors" },
  { name: "Admins", key: "admins" },
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
    return <ErrorPage>Error loading this organization.</ErrorPage>;
  }

  const { name, description, role, logoRef } = data.venue;
  const handleSelectTab = (key) => () => {
    router.query.view = key;
    router.push(router, undefined, { shallow: true });
  };

  return (
    <Layout>
      <Header name={name} logoRef={logoRef} />
      <Grid container>
        <Grid item md={2}>
          <List>
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
        <Grid item md={10}>
          <InfoPane id={id} description={description} />
        </Grid>
      </Grid>
    </Layout>
  );
}

export default withApollo(Venue);
