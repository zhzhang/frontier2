import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import UserTypeahead from "@/components/UserTypeahead";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import gql from "graphql-tag";
import _ from "lodash";
import { useState } from "react";

const MembershipsQuery = gql`
  query MembershipsQuery($input: VenueMembershipsInput!) {
    venueMemberships(input: $input) {
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

const CreateVenueMembershipsMutation = gql`
  mutation CreateVenueMemberships($input: VenueMembershipsCreateInput!) {
    createVenueMemberships(input: $input) {
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

const DeleteVenueMembershipMutation = gql`
  mutation DeleteVenueMembership($id: String!) {
    deleteVenueMembership(id: $id) {
      id
    }
  }
`;

function MembersSelector({ id, role }) {
  const variables = {
    input: { venueId: id, role },
  };
  const { loading, error, data } = useQuery(MembershipsQuery, {
    variables,
  });
  const [createVenueMemberships, createResult] = useMutation(
    CreateVenueMembershipsMutation,
    {
      update(cache, { data: { createVenueMemberships } }) {
        const { venueMemberships } = cache.readQuery({
          query: MembershipsQuery,
          variables,
        });
        cache.writeQuery({
          query: MembershipsQuery,
          variables,
          data: {
            venueMemberships: [...createVenueMemberships, ...venueMemberships],
          },
        });
      },
    }
  );
  const [deleteVenueMembership, deleteResult] = useMutation(
    DeleteVenueMembershipMutation,
    {
      update(cache, { data: { deleteVenueMembership } }) {
        const { venueMemberships } = cache.readQuery({
          query: MembershipsQuery,
          variables,
        });
        cache.writeQuery({
          query: MembershipsQuery,
          variables,
          data: {
            venueMemberships: _.reject(venueMemberships, {
              id: deleteVenueMembership.id,
            }),
          },
        });
      },
    }
  );
  const mutationError = createResult.error || deleteResult.error;
  const [newAdmins, setNewAdmins] = useState([]);
  if (loading) {
    return <Spinner animation="border" style={{ top: "50%", left: "50%" }} />;
  }
  if (error) {
    return (
      <Grid item sm={10}>
        <Error>{`There was a problem retrieving this venue's ${role.toLowerCase()}s.`}</Error>
      </Grid>
    );
  }
  const admins = data.venueMemberships;

  const handleAdd = async () => {
    createVenueMemberships({
      variables: {
        input: {
          role,
          venueId: id,
          userIds: newAdmins.map((user) => user.id),
        },
      },
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item sm={10}>
        <Typography variant="h6">{`${role[0]}${role
          .slice(1)
          .toLowerCase()}s`}</Typography>
      </Grid>
      <Grid item sm={10}>
        <UserTypeahead
          multiple
          selected={newAdmins}
          onChange={(_, selected) => {
            setNewAdmins(selected);
          }}
        />
      </Grid>
      <Grid item sm={2}>
        <Button
          color="primary"
          size="large"
          variant="contained"
          onClick={() => handleAdd()}
        >
          Add
        </Button>
      </Grid>
      <Grid item sm={12}>
        <TableContainer>
          <Table>
            <colgroup>
              <col style={{ width: "90%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <TableBody>
              {admins.map(({ id, user: { name } }) => {
                return (
                  <TableRow>
                    <TableCell>{name}</TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        onClick={async () =>
                          await deleteVenueMembership({
                            variables: {
                              id,
                            },
                          })
                        }
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item sm={12}>
        {mutationError && <Error>{mutationError.message}</Error>}
      </Grid>
    </Grid>
  );
}

export default function MembersPane({ id }) {
  return (
    <>
      <MembersSelector id={id} role="ADMIN" />
      <MembersSelector id={id} role="CHAIR" />
    </>
  );
}
