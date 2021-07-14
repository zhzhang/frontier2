import Editor, { newEditorState, serialize } from "@/components/editor/Editor";
import Layout from "@/components/Layout";
import { withApollo } from "@/lib/apollo";
import { getCroppedImg } from "@/lib/crop";
import { uploadFile } from "@/lib/firebase";
import { UploadTypeEnum } from "@/lib/types";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";
import Router from "next/router";
import { useCallback, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import ReactCrop from "react-image-crop";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  dropzone: {
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    borderStyle: "dashed",
    padding: theme.spacing(1),
    height: "302px",
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
  const [description, setDescription] = useState(newEditorState());
  const [logoFile, setLogoFile] = useState();
  const [logoUrl, setLogoUrl] = useState();
  const [createOrganization, { loading, error, data }] = useMutation(
    CreateOrganizationMutation
  );
  const imgRef = useRef(null);

  const [crop, setCrop] = useState({ aspect: 1, width: 30 });
  if (!loading && data && data.createOrganization) {
    Router.push(`/organization/${data.createOrganization.id}`);
  }
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const handleSubmit = async () => {
    const img = await getCroppedImg(imgRef.current, crop, "hello");
    const { uploadTask, refPath } = uploadFile(img, UploadTypeEnum.LOGO);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {},
      () => {
        createOrganization({
          variables: {
            name,
            abbreviation,
            description: serialize(description),
            logoRef: refPath,
          },
        });
      }
    );
  };

  return (
    <Layout padded>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Create Organization</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            required
            fullWidth
            variant="outlined"
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            variant="outlined"
            label="Abbreviation"
            value={abbreviation}
            onChange={(event) => setAbbreviation(event.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          {logoFile ? (
            <ReactCrop
              src={logoUrl}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onImageLoaded={onLoad}
            />
          ) : (
            <Dropzone
              onDrop={(acceptedFiles) => {
                setLogoFile(acceptedFiles[0]);
                setLogoUrl(URL.createObjectURL(acceptedFiles[0]));
                // const reader = new FileReader();
                // reader.readAsArrayBuffer(acceptedFiles[0]);
                // reader.onload = () => {
                //   setLogoFile(reader.result);
                // };
              }}
              accept={["image/png", "image/jpeg"]}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className={classes.dropzone}>
                  <input {...getInputProps()} />
                  <p>
                    Drag and drop a PDF file here, or click to select PDF file.
                  </p>
                </div>
              )}
            </Dropzone>
          )}
        </Grid>
        <Grid item xs={9}>
          <Editor
            editorState={description}
            onChange={setDescription}
            placeholder="Write a description for your organization."
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmit()}
          >
            Create
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default withApollo(NewOrganization);
