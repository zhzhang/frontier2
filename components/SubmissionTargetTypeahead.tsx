import { useQuery } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import gql from "graphql-tag";
import { useState } from "react";

const SearchQuery = gql`
  query SearchSubmissionTargets($query: String!) {
    searchOrganizations(query: $query) {
      id
      name
      abbreviation
      logoRef
    }
    searchVenues(query: $query) {
      id
      name
      abbreviation
      logoRef
      venueDate
    }
  }
`;

export default function SubmissionTargetTypeahead({
  label = "Search users...",
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { loading, error, data } = useQuery(SearchQuery, {
    variables: { query },
  });
  console.log(data);
  const options = data
    ? data.searchOrganizations
        .map((org) => {
          return { ...org, type: "Organization" };
        })
        .concat(
          data.searchVenues.map((org) => {
            return { ...org, type: "Venue" };
          })
        )
    : [];
  console.log(options);
  console.log(loading);
  console.log("----------");

  return (
    <Autocomplete
      id="user-typeahead"
      {...rest}
      groupBy={(option) => option.type}
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
