import { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import Spinner from "@/components/CenteredSpinner";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import Layout from "@/components/Layout";
import { USER_CHIP_FIELDS } from "@/components/UserChip";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { SyntheticEvent, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

const UserQuery = gql`
  ${USER_CHIP_FIELDS}
  query UserQuery($where: UserWhereUniqueInput!) {
    user(where: $where) {
      ...UserChipFields
    }
  }
`;

const UserArticlesQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  query UserArticlesQuery($id: String!) {
    userArticles(id: $id) {
      ...ArticleCardFields
    }
  }
`;

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function User() {
  const router = useRouter();
  const id = router.query.id;
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { where: { id } },
  });
  const [tab, setTab] = useState(0);
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { name, profilePictureUrl, institution, twitter, website } = data.user;

  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item sm={3} spacing={3} justifyContent="center">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <FirebaseAvatar
              sx={{
                height: "14rem",
                width: "14rem",
              }}
              storeRef={profilePictureUrl}
              name={name}
            />
          </Box>
          <Typography align="center" variant="h5" sx={{ mt: 1 }}>
            {name}
          </Typography>
          <Typography sx={{ mt: 1 }}>{institution}</Typography>
          <Typography sx={{ mt: 1 }}>{website}</Typography>
          <Typography sx={{ mt: 1 }}>{twitter}</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push("/edit-profile")}
            sx={{ marginLeft: "auto" }}
            fullWidth
            size="small"
          >
            Edit Profile
          </Button>
          <Tabs
            orientation="vertical"
            value={tab}
            onChange={handleChange}
            aria-label="Vertical tabs example"
          >
            <Tab label="Articles" {...a11yProps(0)} />
            <Tab label="Reviews" {...a11yProps(1)} />
          </Tabs>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default withApollo(User);
