import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import UserChip, { USER_CHIP_FIELDS } from "@/components/UserChip";
import UserTypeahead from "@/components/UserTypeahead";
import { useMutation } from "@apollo/react-hooks";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { createStyles, makeStyles, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";

const MembershipsQuery = gql`
  ${USER_CHIP_FIELDS}
  query MembershipsQuery($where: VenueMembershipWhereInput!) {
    venueMemberships(where: $where) {
      id
      role
      user {
        ...UserChipFields
      }
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
    },
    divider: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

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
  const classes = useStyles();
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
    <Card className={classes.card}>
      <Grid container spacing={2}>
        <Grid item>
          <ArticleCard article={article} />
        </Grid>
        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>
        <Grid item xs={1}>
          <Typography> Editor</Typography>
        </Grid>
        <Assign />
      </Grid>
    </Card>
  );
}
