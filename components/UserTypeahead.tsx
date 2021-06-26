import { useQuery } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import gql from "graphql-tag";
import { useState } from "react";

const SearchUsersQuery = gql`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      id
      name
      profilePictureUrl
    }
  }
`;

export default function UserTypeahead({ className = "", multiple = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const { loading, error, data } = useQuery(SearchUsersQuery, {
    variables: { query },
  });
  const options = data ? data.searchUsers : [];
  console.log(data);

  return (
    <Autocomplete
      className={className}
      id="user-typeahead"
      multiple
      value={selected}
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
          label="Asynchronous"
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
