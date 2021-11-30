import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import UserChip from "@/components/UserChip";
import UserTypeahead from "@/components/UserTypeahead";
import { useMutation } from "@apollo/react-hooks";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";
import { USER_CARD_FIELDS } from "../UserCard";

const MembershipsQuery = gql`
  ${USER_CARD_FIELDS}
  query MembershipsQuery($where: VenueMembershipWhereInput!) {
    venueMemberships(where: $where) {
      id
      role
      user {
        ...UserCardFields
      }
    }
  }
`;

const AssignOwnerMutation = gql`
  ${ARTICLE_CARD_FIELDS}
  mutation AssignOwner(
    $where: SubmissionWhereUniqueInput!
    $data: SubmissionUpdateInput!
  ) {
    updateOneSubmission(data: $data, where: $where) {
      id
      owner {
        id
        name
      }
      article {
        ...ArticleCardFields
      }
    }
  }
`;

export default function SubmissionCard({ submission, venueId }) {
  const { id, owner, article } = submission;
  const [newOwner, setNewOwner] = useState(owner);
  const [assignOwner, { loading, error, data }] =
    useMutation(AssignOwnerMutation);

  const Assign = () => {
    if (owner) {
      return (
        <Grid item>
          <UserChip user={owner} />
        </Grid>
      );
    }
    return (
      <>
        <Grid item xs={9}>
          <UserTypeahead
            id="select-editor"
            query={MembershipsQuery}
            venueId={venueId}
            selected={newOwner}
            onChange={(_, selected) => {
              setNewOwner(selected);
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            color="primary"
            variant="contained"
            onClick={() =>
              assignOwner({
                variables: {
                  where: { id },
                  data: {
                    owner: {
                      connect: {
                        id: tmp.id,
                      },
                    },
                  },
                },
              })
            }
          >
            Assign
          </Button>
        </Grid>
      </>
    );
  };
  return (
    <Card
      sx={{
        mb: 1,
        p: 1,
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ArticleCard article={article} />
        </Grid>
        <Grid item xs={12}>
          <Divider
            sx={{
              mt: 1,
              mb: 1,
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography> Editor</Typography>
        </Grid>
        <Assign />
      </Grid>
    </Card>
  );
}
