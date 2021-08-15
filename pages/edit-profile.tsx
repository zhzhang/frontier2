import Spinner from "@/components/CenteredSpinner";
import ErrorPage from "@/components/ErrorPage";
import Layout from "@/components/Layout";
import UserTypeahead from "@/components/UserTypeahead";
import { withApollo } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { RelationEnum } from "@/lib/types";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";
import { useCallback, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import ReactCrop from "react-image-crop";

const UserQuery = gql`
  query UserQuery($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      name
      email
      bio
      relations {
        id
        target {
          id
          name
          email
        }
        relation
        endYear
      }
    }
  }
`;

const UpdateUserMutation = gql`
  mutation UpdateUser(
    $id: String!
    $name: String
    $bio: String
    $profilePictureUrl: String
  ) {
    updateUser(
      id: $id
      name: $name
      bio: $bio
      profilePictureUrl: $profilePictureUrl
    ) {
      id
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
        email
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

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
  },
  editButton: {
    marginLeft: "auto",
  },
  dropzone: {
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    borderStyle: "dashed",
    padding: theme.spacing(1),
    height: "150px",
  },
}));

function Relations({ userId, relations }) {
  const [target, setTarget] = useState();
  const [endYear, setEndYear] = useState("");
  const [relationType, setRelationType] = useState("");
  const [addRelation, result] = useMutation(CreateRelationMutation, {
    update(cache, { data: { createOneRelation } }) {
      cache.modify({
        fields: {
          user(prev) {
            console.log(prev);
            return {
              ...prev,
              relations: [...prev.relations, createOneRelation],
            };
          },
        },
      });
    },
  });
  const [deleteRelation, _] = useMutation(DeleteRelationMutation);
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
                    color="secondary"
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
                  <InputLabel id="demo-controlled-open-select-label">
                    Relationship
                  </InputLabel>
                  <Select
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
  // const { name, email, articles, profilePictureUrl } = data.user;
  const classes = useStyles();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [logoUrl, setLogoUrl] = useState("");
  const [crop, setCrop] = useState({ aspect: 1, width: 30 });
  const imgRef = useRef(null);
  const [updateUser, result] = useMutation(UpdateUserMutation);
  const handleUpdateUser = async () => {
    await updateUser({
      variables: {
        id: user.id,
        name,
        bio,
      },
    });
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Editing Profile</Typography>
        </Grid>
        <Grid item xs={5}>
          <TextField
            required
            value={name}
            fullWidth
            variant="outlined"
            label="Name"
            onChange={(event) => setName(event.target.value)}
          />
        </Grid>
        <Grid item xs={7} />
        <Grid item xs={5}>
          <TextField
            value={bio}
            fullWidth
            multiline
            variant="outlined"
            label="Bio"
            onChange={(event) => setBio(event.target.value)}
          />
        </Grid>
        <Grid item xs={7} />
        <Grid item xs={3}>
          {logoUrl ? (
            <ReactCrop
              src={logoUrl}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onImageLoaded={onLoad}
            />
          ) : (
            <Dropzone
              onDrop={(acceptedFiles) => {
                setLogoUrl(URL.createObjectURL(acceptedFiles[0]));
              }}
              accept={["image/png", "image/jpeg"]}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className={classes.dropzone}>
                  <input {...getInputProps()} />
                  <p>
                    (Optional) Drag and drop a logo image here, or click to
                    select file.
                  </p>
                </div>
              )}
            </Dropzone>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateUser}
          >
            Save
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Relations</Typography>
        </Grid>

        <Relations userId={user.id} relations={user.relations} />
      </Grid>
    </Layout>
  );
}

function EditProfile({ id }) {
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { where: { id } },
  });
  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  } else if (error) {
    return null;
  }
  return <Editor user={data.user} />;
}

function RetrieveAndEditProfile() {
  const classes = useStyles();
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner animation="border" />;
  } else if (!user) {
    return (
      <ErrorPage dismissible={false}>
        Please log in to edit your profile.
      </ErrorPage>
    );
  }

  return <EditProfile id={user.uid} />;
}

export default withApollo(RetrieveAndEditProfile);
