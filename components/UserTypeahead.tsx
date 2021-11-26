import { useQuery } from "@apollo/react-hooks";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import gql from "graphql-tag";
import { useState } from "react";
import UserChip from "./UserChip";

const SearchUsersQuery = gql`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      id
      name
      profilePictureUrl
    }
  }
`;

export default function UserTypeahead({
  label = "Search users...",
  gqlQuery = SearchUsersQuery,
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { loading, error, data } = useQuery(gqlQuery, {
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
      renderOption={(user) => <UserChip user={user} canInteract={false} />}
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
