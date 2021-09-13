import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import UserTypeahead from "@/components/UserTypeahead";
import { RoleEnum } from "@/lib/types";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
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
      }
    }
  }
`;

const DeleteOneVenueMembershipMutation = gql`
  mutation DeleteOneVenueMembership($where: VenueMembershipWhereUniqueInput!) {
    deleteOneVenueMembership(where: $where) {
      id
      role
      user {
        id
        name
      }
    }
  }
`;

export default function AdminsPane({ id }) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(MembershipsQuery, {
    variables: {
      where: { venueId: { equals: id }, role: { equals: "ADMIN" } },
    },
  });
  const [createVenueMembership, result] = useMutation(
    CreateOneVenueMembershipMutation
  );
  const [newAdmins, setNewAdmins] = useState([]);
  if (loading) {
    return <Spinner animation="border" style={{ top: "50%", left: "50%" }} />;
  }
  if (error) {
    return (
      <Grid item sm={10}>
        <Error>There was a problem retrieving this venue's admins.</Error>
      </Grid>
    );
  }
  const admins = data.venueMemberships;

  const handleAdd = (user) => {
    createVenueMembership({
      variables: {
        data: {
          role: "ADMIN",
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
          <TableBody>
            {admins.map(({ user: { id, name } }) => {
              console.log(name);
              return (
                <TableRow>
                  <TableCell>{name}</TableCell>
                  <TableCell>
                    <Button
                      color="secondary"
                      onClick={() =>
                        updateOrganizationMembership({
                          variables: {
                            organizationId: id,
                            userId: id,
                            action: "REMOVE",
                            role: RoleEnum.ADMIN,
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
        </TableContainer>
      </Grid>
    </>
  );
}
