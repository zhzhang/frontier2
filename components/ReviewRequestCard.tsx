import gql from "graphql-tag";
import { USER_CARD_FIELDS } from "./UserCard";

export const REVIEW_REQUEST_CARD_FIELDS = gql`
  ${USER_CARD_FIELDS}
  fragment ReviewRequestCardFields on ReviewRequest {
    id
    type
    user {
      ...UserCardFields
    }
  }
`;
