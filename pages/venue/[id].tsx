import ErrorPage from "@/components/ErrorPage";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import ArticlesPane from "@/components/venue/ArticlesPane";
import InfoPane from "@/components/venue/InfoPane";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
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

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
  },
  editButton: {
    marginLeft: "auto",
  },
  logo: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(2),
  },
}));

function Venue() {
  const router = useRouter();
  const id = router.query.id;
  const view = router.query.view ? router.query.view : "info";
  const { loading, error, data } = useQuery(VenueQuery, {
    variables: { where: { id } },
  });
  const classes = useStyles();

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
      <div className={classes.header}>
        <FirebaseAvatar
          storeRef={logoRef}
          className={classes.logo}
          variant="rounded"
          name={name}
        />
        <Typography variant="h5">{name}</Typography>
        <div className={classes.editButton}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push(`/manage-venue/${id}`)}
          >
            Manage
          </Button>
        </div>
      </div>
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