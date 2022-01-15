import Error from "@/components/Error";
import ErrorPage from "@/components/ErrorPage";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import VenueCard, { VENUE_CARD_FIELDS } from "@/components/VenueCard";
import { withApollo } from "@/lib/apollo";
import { useMutation, useQuery } from "@apollo/react-hooks";
import SearchIcon from "@mui/icons-material/Search";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";

const VenueQuery = gql`
  ${VENUE_CARD_FIELDS}
  query VenueQuery {
    venues {
      ...VenueCardFields
    }
  }
`;

const CreateVenueMutation = gql`
  mutation CreateVenueQuery($input: VenueCreateInput!) {
    createVenue(input: $input) {
      id
    }
  }
`;

function CreateVenue() {
  const [createVenue, { error }] = useMutation(CreateVenueMutation);
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [venueDate, setVenueDate] = useState(null);
  const handleSubmit = async () => {
    const resp = await createVenue({
      variables: {
        input: {
          name,
          venueDate,
        },
      },
    });
    window.location.href = `/manage-venue/${resp.data.createVenue.id}`;
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card
        sx={{
          p: 2,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">New Venue</Typography>
          </Grid>
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
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="(Optional) Abbreviation"
              value={abbreviation}
              onChange={(event) => setAbbreviation(event.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="(Optional) Venue Date"
              value={venueDate}
              onChange={(newValue) => {
                setVenueDate(newValue);
              }}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit()}
                disabled={!Boolean(name)}
                sx={{ mr: 2 }}
              >
                Create
              </Button>
            </Box>
          </Grid>
        </Grid>
        {error && <Error>{error.message}</Error>}
      </Card>
    </LocalizationProvider>
  );
}

function Venues() {
  const { loading, error, data } = useQuery(VenueQuery);
  const [createOpen, toggleCreateOpen] = useState(false);

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }
  if (error) {
    return (
      <ErrorPage>Unable to load venues, please try again later.</ErrorPage>
    );
  }

  return (
    <Layout sx={{ maxWidth: 1000 }}>
      <Input
        fullWidth
        disabled
        placeholder="Venue search coming soon!"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
      <Modal
        open={createOpen}
        onClose={() => toggleCreateOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CreateVenue />
      </Modal>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flex: 1 }}>
          <Button>Following</Button>
          <Button>Accepting Review Requests</Button>
        </Box>
        <Button onClick={() => toggleCreateOpen(true)}>Create New Venue</Button>
      </Box>
      {data.venues.map((venue) => (
        <Box sx={{ mt: 2 }} key={venue.id}>
          <VenueCard venue={venue} />
        </Box>
      ))}
    </Layout>
  );
}

export default withApollo(Venues);
