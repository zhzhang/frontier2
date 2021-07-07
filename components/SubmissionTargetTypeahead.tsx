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
  className = "",
  multiple = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const { loading, error, data } = useQuery(SearchQuery, {
    variables: { query },
  });
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

  return (
    <Autocomplete
      className={className}
      id="user-typeahead"
      multiple={multiple}
      value={selected}
      groupBy={(option) => option.type}
      onChange={(event, newSelected) => {
        setSelected(newSelected);
      }}
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
