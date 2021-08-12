import Spinner from "@/components/CenteredSpinner";
import ErrorPage from "@/components/ErrorPage";
import Layout from "@/components/Layout";
import { withApollo } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { useQuery } from "@apollo/react-hooks";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";
import { useCallback, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import ReactCrop from "react-image-crop";

const UserQuery = gql`
  query UserQuery($id: String!) {
    user(id: $id) {
      id
      name
      email
      bio
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

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
  },
  editButton: {
    marginLeft: "auto",
  },
  dropzone: {
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    borderStyle: "dashed",
    padding: theme.spacing(1),
    height: "302px",
  },
}));

function Editor({ user }) {
  // const { name, email, articles, profilePictureUrl } = data.user;
  const classes = useStyles();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [logoUrl, setLogoUrl] = useState("");
  const [crop, setCrop] = useState({ aspect: 1, width: 30 });
  const imgRef = useRef(null);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);
  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Editing Profile</Typography>
        </Grid>
        <Grid item xs={5}>
          <TextField
            required
            value={name}
            fullWidth
            variant="outlined"
            label="Name"
            onChange={(event) => setName(event.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          {logoUrl ? (
            <ReactCrop
              src={logoUrl}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onImageLoaded={onLoad}
            />
          ) : (
            <Dropzone
              onDrop={(acceptedFiles) => {
                setLogoUrl(URL.createObjectURL(acceptedFiles[0]));
              }}
              accept={["image/png", "image/jpeg"]}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className={classes.dropzone}>
                  <input {...getInputProps()} />
                  <p>
                    (Optional) Drag and drop a logo image here, or click to
                    select file.
                  </p>
                </div>
              )}
            </Dropzone>
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={bio}
            fullWidth
            multiline
            variant="outlined"
            label="Bio"
            onChange={(event) => setBio(event.target.value)}
          />
        </Grid>
      </Grid>
    </Layout>
  );
}

function EditProfile({ id }) {
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { id },
  });
  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }
  return <Editor user={data.user} />;
}

function RetrieveAndEditProfile() {
  const classes = useStyles();
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner animation="border" />;
  } else if (!user) {
    return (
      <ErrorPage dismissible={false}>
        Please log in to edit your profile.
      </ErrorPage>
    );
  }

  return <EditProfile id={user.uid} />;
}

export default withApollo(RetrieveAndEditProfile);
