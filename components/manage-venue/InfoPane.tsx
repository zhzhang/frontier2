import MarkdownEditor from "@/components/MarkdownEditor";
import { useMutation } from "@apollo/react-hooks";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import { createStyles, makeStyles, Theme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import gql from "graphql-tag";
import { useCallback, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import ReactCrop from "react-image-crop";

const UpdateVenueMutation = gql`
  mutation UpdateVenue(
    $data: VenueUpdateInput!
    $where: VenueWhereUniqueInput!
  ) {
    updateOneVenue(data: $data, where: $where) {
      id
      name
      abbreviation
      description
      venueDate
      role
      logoRef
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      margin: theme.spacing(1),
    },
    dropzone: {
      border: "1px solid rgba(0, 0, 0, 0.23)",
      borderRadius: "4px",
      borderStyle: "dashed",
      padding: theme.spacing(1),
      height: "150px",
    },
  })
);

export default function InfoPane({ venue }) {
  const classes = useStyles();
  const [name, setName] = useState(venue.name);
  const [abbrev, setAbbrev] = useState(venue.abbreviation);
  const [logoUrl, setLogoUrl] = useState("");
  const [updateVenue, { loading, error, data }] =
    useMutation(UpdateVenueMutation);
  const [crop, setCrop] = useState({ aspect: 1, width: 30 });
  const [desc, setDescription] = useState(venue.description);
  const imgRef = useRef(null);
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);
  let variables = {
    where: {
      id: venue.id,
    },
    data: {
      name: { set: name },
      abbreviation: { set: abbrev },
      description: { set: desc },
    },
  };
  const handleUpdate = () => {
    updateVenue({ variables });
  };

  return (
    <>
      <Grid item sm={10}>
        <TextField
          required
          value={name}
          fullWidth
          variant="outlined"
          label="Name"
          onChange={(event) => setName(event.target.value)}
        />
      </Grid>
      <Grid item sm={2}>
        <TextField
          value={abbrev}
          fullWidth
          variant="outlined"
          label="Abbreviation"
          onChange={(event) => setAbbrev(event.target.value)}
        />
      </Grid>
      <Grid item sm={12}>
        <MarkdownEditor body={desc} onChange={setDescription} />
      </Grid>
      <Grid item sm={12}>
        {logoUrl ? (
          <ReactCrop
            src={logoUrl}
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onImageLoaded={onLoad}
            style={{ height: 200, width: 200 }}
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
                  (Optional) Drag and drop a logo image here, or click to select
                  file.
                </p>
              </div>
            )}
          </Dropzone>
        )}
      </Grid>
      <Grid item>
        <Button color="primary" variant="contained" onClick={handleUpdate}>
          Save
        </Button>
      </Grid>
    </>
  );
}
