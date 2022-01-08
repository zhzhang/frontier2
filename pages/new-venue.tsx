import CenteredSpinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import ErrorSnackbar from "@/components/ErrorSnackbar";
import Layout from "@/components/Layout";
import MarkdownEditor from "@/components/MarkdownEditor";
import { withApollo } from "@/lib/apollo";
import { getCroppedImg } from "@/lib/crop";
import { uploadFile, useAuth } from "@/lib/firebase";
import { UploadTypeEnum } from "@/lib/types";
import { useMutation } from "@apollo/react-hooks";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useCallback, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import ReactCrop from "react-image-crop";

const CreateOneVenueMutation = gql`
  mutation CreateOneVenueQuery($data: VenueCreateInput!) {
    createOneVenue(data: $data) {
      id
    }
  }
`;

function NewVenue({ userId }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [name, setName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [description, setDescription] = useState("");
  const [createVenue, { error }] = useMutation(CreateOneVenueMutation);
  const [logoUrl, setLogoUrl] = useState("");
  const [crop, setCrop] = useState({ aspect: 1, width: 10000 });
  const imgRef = useRef(null);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const handleSubmit = async () => {
    let input = {
      name,
      description,
      memberships: {
        create: [
          {
            role: "ADMIN",
            user: {
              connect: {
                id: userId,
              },
            },
          },
        ],
      },
    };
    if (!imgRef.current) {
      const { data } = await createVenue({
        variables: {
          data: input,
        },
      });
      window.location.href = `/manage-venue/${data.createOneVenue.id}?view=members`;
      return;
    }
    const img = await getCroppedImg(imgRef.current, crop, "hello");
    const { uploadTask, refPath } = uploadFile(img, UploadTypeEnum.LOGO);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploadProgress(
          (100 * snapshot.bytesTransferred) / snapshot.totalBytes
        );
      },
      (error) => {
        setErrorMessage(error);
      },
      async () => {
        setUploadProgress(0);
        try {
          input.logoRef = refPath;
          const { data } = await createVenue({
            variables: {
              data: input,
            },
          });
          window.location.href = `/manage-venue/${data.createOneVenue.id}?view=members`;
        } catch (error) {
          setErrorMessage(error.message);
        }
      }
    );
  };

  const canSubmit = description.length > 0 && name.length > 0;

  return (
    <Layout>
      <ErrorSnackbar error={error} />
      <Grid container spacing={3}>
        <Grid item xs={5}>
          <Typography variant="h4">New Venue</Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            label="Name"
            onChange={(event) => setName(event.target.value)}
            sx={{ mt: 2 }}
          />
          <MarkdownEditor
            body={description}
            onChange={(abstract) => setDescription(abstract)}
            label="Description"
            placeholder="Write a description for your venue."
            sx={{
              mb: 2,
            }}
          />
          <Box sx={{ display: "flex", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              disabled={!canSubmit}
              sx={{ mr: 2 }}
            >
              Create
            </Button>
            <CircularProgress variant="determinate" value={uploadProgress} />
          </Box>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Grid>
        <Grid item xs={7}>
          {logoUrl ? (
            <div style={{ height: 600 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setLogoUrl("")}
              >
                Choose Different File
              </Button>
              <ReactCrop
                src={logoUrl}
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onImageLoaded={onLoad}
              />
            </div>
          ) : (
            <Dropzone
              onDrop={(acceptedFiles) => {
                setLogoUrl(URL.createObjectURL(acceptedFiles[0]));
              }}
              accept={["image/png", "image/jpeg"]}
            >
              {({ getRootProps, getInputProps }) => (
                <Box
                  {...getRootProps()}
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                    borderRadius: "4px",
                    borderStyle: "dashed",
                    padding: 1,
                    height: "150px",
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography>
                    (Optional) Drag and drop a logo image here, or click to
                    select file.
                  </Typography>
                </Box>
              )}
            </Dropzone>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}

function LoggedInNewVenue() {
  const { user, loading } = useAuth();
  if (loading) {
    return <CenteredSpinner />;
  }
  if (!user) {
    return (
      <Layout>
        <Error>Please log in to create a venue.</Error>
      </Layout>
    );
  }
  return <NewVenue userId={user.uid} />;
}

export default withApollo(LoggedInNewVenue);
