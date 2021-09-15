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
  query UserQuery($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      name
      bio
      profilePictureUrl
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
  avatar: {
    height: theme.spacing(10),
    width: theme.spacing(10),
    marginRight: theme.spacing(2),
  },
}));

function User() {
  const classes = useStyles();
  const router = useRouter();
  const id = router.query.id;
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { where: { id } },
  });
  // const articlesResult = useQuery(UserArticlesQuery, {
  //   variables: { id },
  // });

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { name, bio, articles, profilePictureUrl } = data.user;
  const tabKey = "articles";

  return (
    <Layout>
      <div className={classes.header}>
        <FirebaseAvatar
          className={classes.avatar}
          storeRef={profilePictureUrl}
          name={name}
        />
        <div>
          <Typography variant="h5">{name}</Typography>
          {bio}
        </div>
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
