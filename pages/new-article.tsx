import Editor from "@/components/editor/Editor";
import Layout from "@/components/Layout";
import UserTypeahead from "@/components/UserTypeahead";
import { withApollo } from "@/lib/apollo";
import { useMutation } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import gql from "graphql-tag";
import { DropzoneArea } from "material-ui-dropzone";
import { useRouter } from "next/router";
import { useState } from "react";

const CreateArticleMutation = gql`
  mutation CreateArticleQuery(
    $title: String!
    $abstract: String!
    $authorIds: [String!]!
    $ref: String!
  ) {
    createArticle(
      title: $title
      abstract: $abstract
      authorIds: $authorIds
      ref: $ref
    ) {
      id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  formField: {
    paddingTop: theme.spacing(1),
  },
}));

const GetOrganizationQuery = gql`
  query GetVenueQuery($id: String!) {
    organization(id: $id) {
      name
    }
  }
`;

const NewArticle = () => {
  const classes = useStyles();
  const router = useRouter();
  const { organizationId } = router.query;
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authors, setAuthors] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [createArticle, { loading, error, data }] = useMutation(
    CreateArticleMutation
  );

  return (
    <Layout padded>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">New Article</Typography>
        </Grid>
        <Grid item xs={5}>
          <FormControl fullWidth>
            <TextField required variant="outlined" label="Title"></TextField>
          </FormControl>
          <UserTypeahead className={classes.formField} label="Authors" />
          <div className={classes.formField}>
            <Editor placeholder={"Write an abstract."} />
          </div>
          <Autocomplete
            className={classes.formField}
            multiple
            options={[]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Submit to..."
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={7}>
          <DropzoneArea />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default withApollo(NewArticle);
