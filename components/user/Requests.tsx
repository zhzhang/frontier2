import CenteredSpinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import ReviewerSearch from "@/components/ReviewerSearch";
import ReviewRequestActionsPane from "@/components/ReviewRequestActionsPane";
import ReviewRequestCard, {
  REVIEW_REQUEST_CARD_FIELDS,
} from "@/components/ReviewRequestCard";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";
import UserDetailsCard from "../UserDetailsCard";

const RequestsQuery = gql`
  ${REVIEW_REQUEST_CARD_FIELDS}
  query RequestsQuery($userId: String!) {
    userRequests(userId: $userId) {
      ...ReviewRequestCardFields
    }
  }
`;

const ChairRequestReviewMutation = gql`
  ${REVIEW_REQUEST_CARD_FIELDS}
  mutation AssignOwnerMutation($input: ChairRequestReviewInput!) {
    chairRequestReview(input: $input) {
      ...ReviewRequestCardFields
    }
  }
`;

function ActionPane({ articleId, requestId }) {
  const [options, setOptions] = useState([]);
  const [requestReview, _] = useMutation(ChairRequestReviewMutation);
  const onRequest = (id) => {
    requestReview({
      variables: {
        input: {
          userId: id,
          parentRequestId: requestId,
        },
      },
    });
  };
  return (
    <>
      <Typography variant="h6">Request Reviews</Typography>
      <ReviewerSearch
        articleId={articleId}
        setOptions={setOptions}
        sx={{ mt: 1 }}
      />
      <Box sx={{ mt: 1 }}>
        {options.map((user) => (
          <UserDetailsCard user={user} onRequest={onRequest} />
        ))}
      </Box>
      <Divider sx={{ mt: 1, mb: 0.5 }} />
      <Typography variant="h6">Write Decision</Typography>
    </>
  );
}

export default function Requests({ userId }) {
  const { loading, error, data } = useQuery(RequestsQuery, {
    variables: {
      userId,
    },
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  if (loading) {
    return <CenteredSpinner />;
  }
  if (error) {
    return <Error>{error.message}</Error>;
  }
  const requests = data.userRequests;
  if (requests.length === 0) {
    return <Typography>No pending requests!</Typography>;
  }
  const selected = selectedRequest || requests[0];
  return (
    <Grid item container spacing={3}>
      <Grid item sm={6}>
        {requests.map((request) => (
          <ReviewRequestCard
            reviewRequest={request}
            selectedRequest={selected}
            setSelectedRequest={setSelectedRequest}
          />
        ))}
      </Grid>
      <Grid item sm={6}>
        <ReviewRequestActionsPane article={selected?.article}>
          <ActionPane
            articleId={selected?.article.id}
            requestId={selected.id}
          />
        </ReviewRequestActionsPane>
      </Grid>
    </Grid>
  );
}
