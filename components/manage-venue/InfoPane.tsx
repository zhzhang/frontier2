import MarkdownEditor from "@/components/MarkdownEditor";
import { uploadFile } from "@/lib/firebase";
import { UploadTypeEnum } from "@/lib/types";
import { useMutation } from "@apollo/react-hooks";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useCallback, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import ReactCrop from "react-image-crop";
import Error from "../Error";
import { VENUE_CARD_FIELDS } from "../VenueCard";

const UpdateVenueMutation = gql`
  ${VENUE_CARD_FIELDS}
  mutation UpdateVenue($input: VenueUpdateInput!) {
    updateVenue(input: $input) {
      ...VenueCardFields
    }
  }
`;

function tmp() {
  const [logoUrl, setLogoUrl] = useState("");
  const imgRef = useRef(null);
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);
  const [crop, setCrop] = useState({ aspect: 1, width: 10000 });
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
        input.data.logoRef = refPath;
        const { data } = await updateVenue({
          variables,
        });
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  );
  return (
    <Grid item xs={4}>
      {logoUrl ? (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              imgRef.current = null;
              setLogoUrl("");
            }}
          >
            Choose Different File
          </Button>
          <ReactCrop
            src={logoUrl}
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onImageLoaded={onLoad}
          />
        </Box>
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
              sx={{
                border: "1px solid rgba(0, 0, 0, 0.23)",
                borderRadius: "4px",
                borderStyle: "dashed",
                padding: 1,
                height: "150px",
              }}
            >
              <input {...getInputProps()} />
              <Typography>
                (Optional) Drag and drop a logo image here, or click to select
                file.
              </Typography>
            </Box>
          )}
        </Dropzone>
      )}
    </Grid>
  );
}

export default function InfoPane({ venue }) {
  const [name, setName] = useState(venue.name);
  const [abbreviation, setAbbreviation] = useState(venue.abbreviation);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [description, setDescription] = useState(venue.description);
  const [updateVenue, { error }] = useMutation(UpdateVenueMutation);
  const [venueDate, setVenueDate] = useState(venue.venueDate);
  const [submissionDeadline, setSubmissionDeadline] = useState(
    venue.submissionDeadline
  );

  const handleSubmit = async () => {
    let variables = {
      input: {
        venueId: venue.id,
        name,
        description,
        abbreviation,
        venueDate,
        submissionDeadline,
      },
    };
    await updateVenue({
      variables,
    });
  };

  const canSubmit = name.length > 0;

  return (
    <Grid item container spacing={3}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            variant="outlined"
            label="Name"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            variant="outlined"
            label="(Optional) Abbreviation"
            value={abbreviation}
            onChange={(event) => setAbbreviation(event.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <DatePicker
            label="(Optional) Venue Date"
            value={venueDate}
            onChange={(newValue) => {
              setVenueDate(newValue);
            }}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </Grid>
        <Grid item xs={4}>
          <DatePicker
            label="(Optional) Submission Deadline"
            value={submissionDeadline}
            onChange={(newValue) => {
              setSubmissionDeadline(newValue);
            }}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </Grid>
        <Grid item xs={12}>
          <MarkdownEditor
            body={description}
            onChange={(abstract) => setDescription(abstract)}
            label="Description"
            placeholder="(Optional) Add a description for this venue."
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              disabled={!canSubmit}
              sx={{ mr: 2 }}
            >
              Save
            </Button>
            <CircularProgress variant="determinate" value={uploadProgress} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          {error && <Error>{error.message}</Error>}
        </Grid>
      </LocalizationProvider>
    </Grid>
  );
}
