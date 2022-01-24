import MarkdownEditor from "@/components/MarkdownEditor";
import { VENUE_CARD_FIELDS } from "@/components/VenueCard";
import { useMutation } from "@apollo/react-hooks";
import { Grid } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import gql from "graphql-tag";
import { useState } from "react";

const UpdateVenueMutation = gql`
  ${VENUE_CARD_FIELDS}
  mutation UpdateVenue($input: VenueUpdateInput!) {
    updateVenue(input: $input) {
      ...VenueCardFields
    }
  }
`;

export default function ReviewSettingsPane({ venue }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [reviewTemplate, setReviewTemplate] = useState(venue.reviewTemplate);
  const [updateVenue, { error }] = useMutation(UpdateVenueMutation);
  const [acceptingSubmissions, setAcceptingSubmissions] = useState(
    venue.acceptingSubmissions
  );
  const handleSubmit = async () => {
    let variables = {
      input: {
        venueId: venue.id,
        reviewTemplate,
        acceptingSubmissions,
      },
    };
    await updateVenue({
      variables,
    });
  };

  return (
    <Grid item container spacing={3} sx={{ maxWidth: 800 }}>
      <Grid item xs={12}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={acceptingSubmissions}
                onChange={() => setAcceptingSubmissions(!acceptingSubmissions)}
              />
            }
            label="Accepting Submissions"
          />
        </FormGroup>
      </Grid>
      <Grid item xs={12}>
        <MarkdownEditor
          body={reviewTemplate}
          onChange={(value) => setReviewTemplate(value)}
          label="Review Template"
          placeholder="Add review guidelines."
        />
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: "flex" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmit()}
            sx={{ mr: 2 }}
          >
            Save
          </Button>
        </Box>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Grid>
    </Grid>
  );
}
