import UserTypeahead from "@/components/UserTypeahead";
import { RelationEnum } from "@/lib/types";
import { useMutation, useQuery } from "@apollo/react-hooks";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import dateformat from "dateformat";
import gql from "graphql-tag";
import _ from "lodash";
import { useState } from "react";

const RelationsQuery = gql`
  query RelationsQuery($userId: String!) {
    userRelations(userId: $userId) {
      id
      target {
        id
        name
      }
      relation
      endDate
    }
  }
`;

const CreateRelationMutation = gql`
  mutation CreateRelation($input: AddRelationInput!) {
    addRelation(input: $input) {
      id
      target {
        id
        name
      }
      relation
      endDate
    }
  }
`;

const DeleteRelationMutation = gql`
  mutation DeleteRelation($id: String!) {
    deleteRelation(id: $id) {
      id
    }
  }
`;

function RelationRows({ relations, userId }) {
  const [deleteRelation, _result] = useMutation(DeleteRelationMutation, {
    update(cache, { data: { deleteRelation } }) {
      const variables = { userId };
      const { userRelations } = cache.readQuery({
        query: RelationsQuery,
        variables,
      });
      cache.writeQuery({
        query: RelationsQuery,
        variables,
        data: {
          userRelations: _.reject(userRelations, { id: deleteRelation.id }),
        },
      });
    },
  });
  return (
    <>
      {relations?.map(({ id, target, endDate, relation }) => (
        <TableRow key={id}>
          <TableCell component="th" scope="row">
            {target.name}
          </TableCell>
          <TableCell>
            {relation.charAt(0) + relation.slice(1).toLowerCase()}
          </TableCell>
          <TableCell>{endDate && dateformat(endDate, "yyyy-mm-dd")}</TableCell>
          <TableCell>
            <Button
              color="error"
              onClick={() =>
                deleteRelation({
                  variables: { id },
                })
              }
            >
              Remove
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function Relations({ userId }) {
  const [target, setTarget] = useState();
  const [endDate, setEndDate] = useState(null);
  const [relationType, setRelationType] = useState("");
  const variables = { userId };
  const { loading, error, data } = useQuery(RelationsQuery, {
    variables,
  });
  const [addRelation, result] = useMutation(CreateRelationMutation, {
    update(cache, { data: { addRelation } }) {
      const { userRelations } = cache.readQuery({
        query: RelationsQuery,
        variables,
      });
      cache.writeQuery({
        query: RelationsQuery,
        variables,
        data: {
          userRelations: [...userRelations, addRelation],
        },
      });
    },
  });

  const handleAddRelation = () => {
    addRelation({
      variables: {
        input: {
          userId,
          targetId: target.id,
          relation: relationType,
          endDate,
        },
      },
    });
    setTarget(null);
    setEndDate(null);
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container xs={12}>
        <Grid item sm={12}>
          <Typography variant="h5">Relations</Typography>
        </Grid>
        <Grid item sm={12}>
          <TableContainer>
            <Table aria-label="simple table">
              <colgroup>
                <col style={{ width: "40%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "10%" }} />
              </colgroup>
              <TableBody>
                {loading && <Skeleton variant="text" />}
                <RelationRows relations={data?.userRelations} userId={userId} />
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
                      <InputLabel id="relationship-type">
                        Relationship
                      </InputLabel>
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
                    <DatePicker
                      label="(Optional) End Date"
                      value={endDate}
                      onChange={(newValue) => {
                        setEndDate(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField fullWidth {...params} />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={handleAddRelation}
                      disabled={!(target && relationType)}
                    >
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
