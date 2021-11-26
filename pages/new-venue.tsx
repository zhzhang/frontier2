import Layout from "@/components/Layout";
import { withApollo } from "@/lib/apollo";
import { getCroppedImg } from "@/lib/crop";
import { uploadFile, useAuth } from "@/lib/firebase";
import { RoleEnum, UploadTypeEnum } from "@/lib/types";
import { useMutation } from "@apollo/react-hooks";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
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
    padding: theme.spacing(2),
    height: "220",
  },
}));

const CreateVenueMutation = gql`
  mutation CreateVenueQuery($data: VenueCreateInput!) {
    createOneVenue(data: $data) {
      id
    }
  }
`;

const NewVenue = () => {
  const { user } = useAuth();
  const classes = useStyles();
  const [name, setName] = useState();
  const [abbreviation, setAbbreviation] = useState();
  const [websiteUrl, setWebsiteUrl] = useState();
  const [description, setDescription] = useState();
  const [logoUrl, setLogoUrl] = useState("");
  const [createVenue, { loading, error, data }] =
    useMutation(CreateVenueMutation);
  const imgRef = useRef(null);
  const [venueDate, setVenueDate] = useState<Date | null>();
  const [submissionDeadline, setSubmissionDeadline] = useState<Date | null>();
  const [submissionsOpen, setSubmissionOpen] = useState<Date | null>();

  const [crop, setCrop] = useState({ aspect: 1, width: 30 });
  if (!loading && data && data.createOneVenue) {
    Router.push(`/venue/${data.createOneVenue.id}`);
  }
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const handleSubmit = async () => {
    let data = {
      name,
      websiteUrl,
      abbreviation,
      description: description,
      venueDate,
      submissionDeadline,
      submissionsOpen,
      memberships: {
        create: [
          {
            role: RoleEnum.ADMIN,
            user: {
              connect: {
                id: user.uid,
              },
            },
          },
        ],
      },
    };
    if (!imgRef.current) {
      await createVenue({
        variables: { data },
      });
      return;
    }
    const img = await getCroppedImg(imgRef.current, crop, "hello");
    const { uploadTask, refPath } = uploadFile(img, UploadTypeEnum.LOGO);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {},
      () => {
        createVenue({
          variables: {
            data: {
              ...data,
              logoRef: refPath,
            },
          },
        });
      }
    );
  };

  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Create Venue</Typography>
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

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={2}>
            <DateTimePicker
              fullWidth
              inputVariant="outlined"
              id="date-picker-dialog"
              label="Venue Date"
              format="MM/dd/yyyy"
              value={venueDate}
              onChange={setVenueDate}
            />
          </Grid>
          <Grid item xs={2}>
            <DateTimePicker
              fullWidth
              inputVariant="outlined"
              id="date-picker-dialog"
              label="Submission Deadline"
              format="MM/dd/yyyy"
              value={submissionDeadline}
              onChange={setSubmissionDeadline}
            />
          </Grid>
          <Grid item xs={2}>
            <DateTimePicker
              fullWidth
              inputVariant="outlined"
              id="date-picker-dialog"
              label="Submissions Open"
              format="MM/dd/yyyy"
              value={submissionsOpen}
              onChange={setSubmissionOpen}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid item xs={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Website URL"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
          />
        </Grid>
        <Grid item xs={10}>
          <TextField
            value={description}
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            onChange={(event) => setDescription(event.target.value)}
            label="Description"
            placeholder="Write a description."
          />
        </Grid>
        <Grid item xs={2}>
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

export default withApollo(NewVenue);
