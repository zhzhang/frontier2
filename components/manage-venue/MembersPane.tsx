import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import UserTypeahead from "@/components/UserTypeahead";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import gql from "graphql-tag";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      display: "flex",
    },
    headerItem: {
      marginRight: theme.spacing(2),
    },
    nav: {
      padding: theme.spacing(1),
    },
  })
);

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
  const classes = useStyles();
  const { loading, error, data } = useQuery(MembershipsQuery, {
    variables: {
      where: { venueId: { equals: id }, role: { equals: role } },
    },
  });
  const [createVenueMembership, createResult] = useMutation(
    CreateOneVenueMembershipMutation
  );
  const [deleteVenueMembership, deleteResult] = useMutation(
    DeleteOneVenueMembershipMutation
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

  const handleAdd = (user) => {
    createVenueMembership({
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
    <>
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
                console.log(name);
                return (
                  <TableRow>
                    <TableCell>{name}</TableCell>
                    <TableCell>
                      <Button
                        color="secondary"
                        onClick={() =>
                          deleteVenueMembership({
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
    </>
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
