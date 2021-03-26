import { AsyncTypeahead } from "react-bootstrap-typeahead";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useState } from "react";

const SearchEditors = gql`
  query SearchEditors($query: String!, $organizationId: String!) {
    searchEditors(query: $query, organizationId: $organizationId) {
      id
      name
      email
    }
  }
`;

const EditorTypeahead = ({
  id,
  organizationId,
  selected,
  onChangeSelection,
}) => {
  const [query, setQuery] = useState("");
  const { loading, error, data } = useQuery(SearchEditors, {
    variables: { query, organizationId },
  });
  var options = [];
  if (data !== undefined) {
    options = data.searchEditors;
  }

  return (
    <AsyncTypeahead
      id={id}
      multiple={false}
      isLoading={loading}
      options={options}
      onSearch={(query) => setQuery(query)}
      minLength={1}
      labelKey="name"
      placeholder="Search users."
      selected={selected}
      onChange={onChangeSelection}
    />
  );
};

export default EditorTypeahead;
