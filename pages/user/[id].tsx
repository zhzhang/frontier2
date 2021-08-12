import FirebaseAvatar from "@/components/FirebaseAvatar";
import { useQuery } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "../../components/CenteredSpinner";
import Layout from "../../components/Layout";
import { withApollo } from "../../lib/apollo";

const UserQuery = gql`
  query UserQuery($id: String!) {
    user(id: $id) {
      id
      name
      email
      articles {
        id
        authors {
          id
          name
        }
        title
        versions {
          id
          versionNumber
          abstract
        }
        acceptedOrganizations {
          id
          name
        }
      }
    }
  }
`;

const UserArticlesQuery = gql`
  query UserArticlesQuery($id: String!) {
    userArticles(id: $id) {
      id
      authors {
        id
        name
      }
      title
      versions {
        id
        versionNumber
        abstract
      }
      acceptedOrganizations {
        id
        name
      }
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
}));

function User() {
  const classes = useStyles();
  const router = useRouter();
  const id = router.query.id;
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { id },
  });
  const articlesResult = useQuery(UserArticlesQuery, {
    variables: { id },
  });

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { name, email, articles, profilePictureUrl } = data.user;
  const tabKey = "articles";

  return (
    <Layout>
      <div className={classes.header}>
        <FirebaseAvatar storeRef={profilePictureUrl} name={name} />
        <Typography variant="h5">{name}</Typography>
        <div className={classes.editButton}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push("/edit-profile")}
          >
            Edit
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default withApollo(User);
