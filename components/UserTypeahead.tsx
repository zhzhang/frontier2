import FirebaseAvatar from "@/components/FirebaseAvatar";
import UserChip, { USER_CHIP_FIELDS } from "@/components/UserChip";
import { useQuery } from "@apollo/react-hooks";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import gql from "graphql-tag";
import { useState } from "react";

const SearchUsersQuery = gql`
  ${USER_CHIP_FIELDS}
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      ...UserChipFields
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
      debounceTimeout: 500,
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
      renderTags={(selected, getTagProps) => {
        return selected.map((user, index) => {
          const { id, name, profilePictureUrl } = user;
          return (
            <Chip
              key={id}
              variant="outlined"
              {...getTagProps({ index })}
              label={name}
              avatar={
                <FirebaseAvatar
                  storeRef={profilePictureUrl}
                  name={name}
                  sx={{
                    width: 30,
                    height: 30,
                    marginRight: 0.5,
                  }}
                />
              }
            />
          );
        });
      }}
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
