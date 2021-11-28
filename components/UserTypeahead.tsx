import { useQuery } from "@apollo/react-hooks";
import Autocomplete from "@mui/material/Autocomplete";
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
    context: {
      debounceKey: "user-typeahead",
      debounceTimeout: 300,
    },
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
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderOption={(props, user) => (
        <UserChip user={user} canInteract={false} {...props} />
      )}
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
