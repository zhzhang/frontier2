import { USER_CARD_FIELDS } from "@/components/UserCard";
import UserTypeahead from "@/components/UserTypeahead";
import { withApollo } from "@/lib/apollo";
import { RelationEnum } from "@/lib/types";
import { useMutation } from "@apollo/react-hooks";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";

const UserQuery = gql`
  ${USER_CARD_FIELDS}
  query UserQuery($where: UserWhereUniqueInput!) {
    user(where: $where) {
      ...UserCardFields
      relations {
        id
        target {
          id
          name
        }
        relation
        endYear
      }
    }
  }
`;

const UpdateUserMutation = gql`
  ${USER_CARD_FIELDS}
  mutation UpdateUser($input: UserUpdateInput!) {
    updateUser(input: $input) {
      ...UserCardFields
    }
  }
`;

const CreateRelationMutation = gql`
  mutation CreateRelation($data: RelationCreateInput!) {
    createOneRelation(data: $data) {
      id
      target {
        id
        name
      }
      relation
      endYear
    }
  }
`;

const DeleteRelationMutation = gql`
  mutation DeleteRelation($where: RelationWhereUniqueInput!) {
    deleteOneRelation(where: $where) {
      id
    }
  }
`;

function Relations({ userId, relations }) {
  const [target, setTarget] = useState();
  const [endYear, setEndYear] = useState("");
  const [relationType, setRelationType] = useState("");
  const [addRelation, result] = useMutation(CreateRelationMutation, {
    update(cache, { data: { createOneRelation } }) {
      const variables = { where: { id: userId } };
      const { user } = cache.readQuery({
        query: UserQuery,
        variables,
      });
      cache.writeQuery({
        query: UserQuery,
        variables,
        data: {
          user: {
            ...user,
            relations: [...user.relations, createOneRelation],
          },
        },
      });
    },
  });
  const [deleteRelation, _] = useMutation(DeleteRelationMutation, {
    update(cache, { data: { deleteOneRelation } }) {
      const variables = { where: { id: userId } };
      const { user } = cache.readQuery({
        query: UserQuery,
        variables,
      });
      cache.writeQuery({
        query: UserQuery,
        variables,
        data: {
          user: {
            ...user,
            relations: user.relations.filter(
              (relation) => relation.id !== deleteOneRelation.id
            ),
          },
        },
      });
    },
  });
  const handleAddRelation = () => {
    addRelation({
      variables: {
        data: {
          id: userId + target.id,
          user: {
            connect: {
              id: userId,
            },
          },
          relation: relationType,
          endYear,
          target: {
            connect: {
              id: target.id,
            },
          },
        },
      },
    });
    setTarget(null);
    setEndYear("");
    setRelationType("");
  };
  const relationMenuItems = [];
  const handleRelationTypeChange = (event) => {
    setRelationType(event.target.value);
  };
  for (let rel in RelationEnum) {
    relationMenuItems.push(
      <MenuItem key={rel} value={rel}>
        {rel.charAt(0) + rel.slice(1).toLowerCase()}
      </MenuItem>
    );
  }
  return (
    <Grid item xs={12}>
      <TableContainer>
        <Table aria-label="simple table">
          <colgroup>
            <col style={{ width: "50%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <TableBody>
            {relations.map(({ id, target, endYear, relation }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  {target.name}
                </TableCell>
                <TableCell>
                  {relation.charAt(0) + relation.slice(1).toLowerCase()}
                </TableCell>
                <TableCell>{endYear}</TableCell>
                <TableCell>
                  <Button
                    color="error"
                    onClick={() =>
                      deleteRelation({
                        variables: { where: { id } },
                      })
                    }
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow key="new">
              <TableCell>
                <UserTypeahead
                  id="add-relation-typeahead"
                  selected={target}
                  onChange={(_, selected) => {
                    setTarget(selected);
                  }}
                />
              </TableCell>
              <TableCell>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="relationship-type">Relationship</InputLabel>
                  <Select
                    label="Relationship"
                    value={relationType}
                    onChange={handleRelationTypeChange}
                  >
                    {relationMenuItems}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <TextField
                  value={endYear}
                  variant="outlined"
                  label="End Year"
                  onChange={(event) => setEndYear(event.target.value)}
                />
              </TableCell>
              <TableCell>
                <Button onClick={handleAddRelation}>Add</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

function Editor({ user }) {
  const [name, setName] = useState(user.name);
  const [website, setWebsite] = useState(user.website || "");
  const [institution, setInstitution] = useState(user.institution || "");
  const [updateUser, result] = useMutation(UpdateUserMutation);
  let variables = {
    input: {
      id: user.id,
    },
    data: {
      name: { set: name },
    },
  };
  if (website) {
    variables.data.website = { set: website };
  }
  if (institution) {
    variables.data.institution = { set: institution };
  }
  const handleUpdateUser = async () => {
    await updateUser({
      variables,
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Edit Your Profile</Typography>
      </Grid>
      <Grid item container sm={3} spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            value={name}
            fullWidth
            variant="outlined"
            label="Name"
            onChange={(event) => setName(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={website}
            fullWidth
            variant="outlined"
            label="Website"
            onChange={(event) => setWebsite(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={institution}
            fullWidth
            variant="outlined"
            label="Current Institution"
            onChange={(event) => setInstitution(event.target.value)}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleUpdateUser}>
          Save
        </Button>
      </Grid>
    </Grid>
  );
}

export default withApollo(Editor);
