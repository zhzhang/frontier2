import { useQuery } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import gql from "graphql-tag";
import { useState } from "react";

const SearchEditorsQuery = gql`
  query SearchEditors($query: String!, $organizationId: String!) {
    searchEditors(query: $query, organizationId: $organizationId) {
      id
      name
      email
    }
  }
`;

export default function EditorTypeahead({
  label = "Search users...",
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { loading, error, data } = useQuery(SearchEditorsQuery, {
    variables: { query },
  });
  const options = data ? data.searchUsers : [];

  return (
    <Autocomplete
      {...rest}
      id="user-typeahead"
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
