import { formatVenueAbbreviation } from "@/lib/utils";
import { useQuery } from "@apollo/react-hooks";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import gql from "graphql-tag";
import { useState } from "react";

const SearchQuery = gql`
  query SearchSubmissionTargets($query: String!) {
    searchOpenVenues(query: $query) {
      id
      name
      abbreviation
      logoRef
      venueDate
    }
  }
`;

export default function SubmissionTargetTypeahead({
  label = "Search venues...",
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { loading, error, data } = useQuery(SearchQuery, {
    variables: {
      query,
    },
  });
  const options = data
    ? data.searchOpenVenues.map((venue) => {
        let abbrev = formatVenueAbbreviation(venue);
        abbrev = abbrev ? `(${abbrev}) ` : "";
        return { id: venue.id, name: `${abbrev}${venue.name}`, type: "Venue" };
      })
    : [];

  return (
    <Autocomplete
      id="submission-target-typeahead"
      {...rest}
      inputValue={query}
      onInputChange={(event, newQuery) => {
        setQuery(newQuery);
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
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
  );
}
