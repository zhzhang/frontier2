import { useQuery } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import gql from "graphql-tag";
import { useState } from "react";

const MembershipsQuery = gql`
  query MembershipsQuery($where: VenueMembershipWhereInput!) {
    venueMemberships(where: $where) {
      id
      role
      user {
        id
        name
        profilePictureUrl
      }
    }
  }
`;

export default function EditorTypeahead({ venueId, ...rest }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { loading, error, data } = useQuery(MembershipsQuery, {
    variables: {
      where: {
        AND: [
          { venueId: { equals: venueId } },
          { role: { equals: "CHAIR" } },
          { user: { name: { contains: query } } },
        ],
      },
    },
  });
  console.log(data);
  const options = data ? data.venueMemberships.map(({ user }) => user) : [];

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
          label={"Search chairs..."}
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
