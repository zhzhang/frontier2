import Editor from "@/components/editor/Editor";
import Layout from "@/components/Layout";
import { withApollo } from "@/lib/apollo";
import { useMutation } from "@apollo/react-hooks";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";
import { DropzoneArea } from "material-ui-dropzone";
import Router from "next/router";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const CreateOrganizationMutation = gql`
  mutation CreateOrganizationQuery(
    $name: String!
    $description: String!
    $abbreviation: String
    $logoRef: String
  ) {
    createOrganization(
      name: $name
      description: $description
      abbreviation: $abbreviation
      logoRef: $logoRef
    ) {
      id
    }
  }
`;

const NewOrganization = () => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState(null);
  const [description, setDescription] = useState(
    "Write a description of your organization!"
  );
  const [previewOpen, setPreviewOpen] = useState(true);
  const [logoFile, setLogoFile] = useState();
  const [createOrganization, { loading, error, data }] = useMutation(
    CreateOrganizationMutation
  );
  if (!loading && data && data.createOrganization) {
    Router.push(`/organization/${data.createOrganization.id}`);
  }

  return (
    <Layout>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4">Create Organization</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <TextField required label="Name"></TextField>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl>
              <TextField label="Abbreviation"></TextField>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            Logo
            <DropzoneArea />
          </Grid>
          <Grid item xs={9}>
            Description
            <Editor />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default withApollo(NewOrganization);
