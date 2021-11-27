import Spinner from "@/components/CenteredSpinner";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Layout from "@/components/Layout";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import "react-datepicker/dist/react-datepicker.css";

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

function User() {
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
      <Box sx={{ display: "flex" }}>
        <FirebaseAvatar
          sx={{
            h: 10,
            w: 10,
            marginRight: 2,
          }}
          storeRef={profilePictureUrl}
          name={name}
        />
        <div>
          <Typography variant="h5">{name}</Typography>
          {bio}
        </div>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => router.push("/edit-profile")}
          sx={{ marginLeft: "auto" }}
        >
          Edit
        </Button>
      </Box>
    </Layout>
  );
}

export default withApollo(User);
