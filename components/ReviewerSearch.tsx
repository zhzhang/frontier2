import { useQuery } from "@apollo/client";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import gql from "graphql-tag";
import { useEffect, useState } from "react";
import { USER_CARD_FIELDS } from "./UserCard";

const RequestsQuery = gql`
  ${USER_CARD_FIELDS}
  query SearchReviewersQuery($input: SearchReviewersInput!) {
    searchReviewers(input: $input) {
      ...UserCardFields
    }
  }
`;

export default function ReviewerSearch({ articleId, setOptions, sx = null }) {
  const [query, setQuery] = useState("");
  const { loading, data, error } = useQuery(RequestsQuery, {
    variables: {
      input: {
        articleId,
        query,
      },
    },
    context: {
      debounceTimeout: 500,
      debounceKey: "searchReviewers",
    },
  });
  useEffect(() => {
    if (data) {
      setOptions(data.searchReviewers);
    }
  });
  return (
    <Input
      fullWidth
      placeholder="Search Reviewers"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      sx={sx}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
    />
  );
}
