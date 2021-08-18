import Error from "@/components/Error";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import ArticlesPane from "@/components/organization/ArticlesPane";
import InfoPane from "@/components/organization/InfoPane";
import VenuesPane from "@/components/organization/VenuesPane";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import "react-datepicker/dist/react-datepicker.css";

const OrganizationQuery = gql`
  query OrganizationQuery($where: OrganizationWhereUniqueInput!) {
    organization(where: $where) {
      id
      name
      description
      role
      logoRef
    }
  }
`;

const useStyles = makeStyles((theme) => ({
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
}));

function Organization() {
  const router = useRouter();
  const id = router.query.id;
  const view = router.query.view ? router.query.view : "info";
  const { loading, error, data } = useQuery(OrganizationQuery, {
    variables: { where: { id } },
  });
  const classes = useStyles();

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <Error>Error loading this organization.</Error>;
  }

  const { name, description, role, logoRef } = data.organization;
  const getTab = () => {
    switch (view) {
      case "venues":
        return {
          body: <VenuesPane id={id} />,
          tab: 1,
        };
      case "articles":
        return {
          body: <ArticlesPane id={id} />,
          tab: 2,
        };
      default:
        return {
          body: <InfoPane id={id} description={description} role={role} />,
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
        <Typography variant="h4">{name}</Typography>
      </div>
      <Tabs
        value={tab}
        indicatorColor="primary"
        textColor="primary"
        onChange={(event, newIndex) => {
          let newTabKey = "info";
          if (newIndex === 1) {
            newTabKey = "venues";
          } else if (newIndex === 2) {
            newTabKey = "articles";
          }
          router.query.view = newTabKey;
          router.push(router, undefined, { shallow: true });
        }}
      >
        <Tab label="info" />
        <Tab label="venues" />
        <Tab label="articles" />
      </Tabs>
      {body}
    </Layout>
  );
}

export default withApollo(Organization);
