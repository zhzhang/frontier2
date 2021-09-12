import { useQuery } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
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
    ? data.searchOpenVenues.map(({ abbreviation, venueDate, name }) => {
        let abbrev = abbreviation;
        if (venueDate) {
          abbrev = `${abbrev} ${new Date(venueDate).getFullYear()}`;
        }
        abbrev = abbreviation && `(${abbrev}) `;
        return { name: `${abbrev}${name}`, type: "Venue" };
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
      getOptionSelected={(option, value) => option.name === value.name}
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
