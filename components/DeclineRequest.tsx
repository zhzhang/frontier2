import { useMutation } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";
import { REVIEW_REQUEST_CARD_FIELDS } from "./ReviewRequestCard";

const DeclineReviewRequestMutations = gql`
  ${REVIEW_REQUEST_CARD_FIELDS}
  mutation DeclineReviewRequest($input: DeclineReviewRequestInput!) {
    declineReviewRequest(input: $input) {
      ...ReviewRequestCardFields
    }
  }
`;

export default function DeclineRequest({ request }) {
  const [note, setNote] = useState("");
  const [declineRequest, { loading, error, data }] = useMutation(
    DeclineReviewRequestMutations,
    {
      update(cache, _) {
        cache.refetchQueries({
          include: ["RequestsQuery"],
        });
      },
    }
  );
  return (
    <Box>
      <Typography variant="h6" sx={{ pb: 1 }}>
        Decline
      </Typography>
      <TextField
        id="outlined-multiline-static"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        multiline
        fullWidth
        rows={2}
        placeholder="Reason for declining."
      />
      <Box sx={{ justifyContent: "end", textAlign: "right" }}>
        <Button
          color="error"
          onClick={() => {
            declineRequest({
              variables: {
                input: {
                  id: request.id,
                  note,
                },
              },
            });
          }}
        >
          Decline
        </Button>
      </Box>
    </Box>
  );
}
