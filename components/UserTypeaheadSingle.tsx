import { AsyncTypeahead } from "react-bootstrap-typeahead";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useState } from "react";

const SearchUsers = gql`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      id
      name
      email
    }
  }
`;

const UserTypeaheadSingle = ({ id, selected, onChangeSelection }) => {
  const [query, setQuery] = useState("");
  const { loading, error, data } = useQuery(SearchUsers, {
    variables: { query },
  });
  var options = [];
  if (data !== undefined) {
    options = data.searchUsers;
  }

  return (
    <AsyncTypeahead
      id={id}
      multiple={false}
      isLoading={loading}
      options={options}
      onSearch={(query) => setQuery(query)}
      minLength={2}
      labelKey="name"
      placeholder="Search users."
      selected={selected}
      onChange={onChangeSelection}
    />
  );
};

export default UserTypeaheadSingle;
