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

const CreateOneVenueMembershipMutation = gql`
  mutation CreateOneVenueMembership($data: VenueMembershipCreateInput!) {
    createOneVenueMembership(data: $data) {
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

const DeleteOneVenueMembershipMutation = gql`
  mutation DeleteOneVenueMembership($where: VenueMembershipWhereUniqueInput!) {
    deleteOneVenueMembership(where: $where) {
      id
    }
  }
`;

function MembersSelector({ id, role }) {
  const variables = {
    where: { venueId: { equals: id }, role: { equals: role } },
  };
  const { loading, error, data } = useQuery(MembershipsQuery, {
    variables,
  });
  const [createVenueMembership, createResult] = useMutation(
    CreateOneVenueMembershipMutation
  );
  const [deleteVenueMembership, deleteResult] = useMutation(
    DeleteOneVenueMembershipMutation,
    {
      update(cache, { data: { deleteOneVenueMembership } }) {
        const { venueMemberships } = cache.readQuery({
          query: MembershipsQuery,
          variables,
        });
        cache.writeQuery({
          query: MembershipsQuery,
          variables,
          data: {
            venueMemberships: _.reject(venueMemberships, {
              id: deleteOneVenueMembership.id,
            }),
          },
        });
      },
    }
  );
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

  const handleAdd = async (user) => {
    const membership = createVenueMembership({
      variables: {
        data: {
          role,
          user: {
            connect: {
              id: user.id,
            },
          },
          venue: {
            connect: {
              id,
            },
          },
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
          onClick={() => {
            newAdmins.map((user) => handleAdd(user));
          }}
        >
          Add
        </Button>
      </Grid>
      <Grid item sm={12}>
        <TableContainer>
          <Table aria-label="simple table">
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
                        color="secondary"
                        onClick={async () =>
                          await deleteVenueMembership({
                            variables: {
                              where: {
                                id,
                              },
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
