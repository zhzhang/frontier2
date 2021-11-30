import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import ErrorPage from "@/components/ErrorPage";
import Layout from "@/components/Layout";
import { USER_CARD_FIELDS } from "@/components/UserCard";
import UserTypeahead from "@/components/UserTypeahead";
import { withApollo } from "@/lib/apollo";
import { getCroppedImg } from "@/lib/crop";
import { uploadFile, useAuth } from "@/lib/firebase";
import { RelationEnum, UploadTypeEnum } from "@/lib/types";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
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
import Router from "next/router";
import { useCallback, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import ReactCrop from "react-image-crop";

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
  mutation UpdateUser($data: UserUpdateInput!, $where: UserWhereUniqueInput!) {
    updateOneUser(data: $data, where: $where) {
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
                  onChange={(all) => {
                    console.log(all);
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
  const [website, setWebsite] = useState(user.website);
  const [institution, setInstitution] = useState(user.institution);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [crop, setCrop] = useState({ aspect: 1, width: 30 });
  const imgRef = useRef(null);
  const [updateUser, result] = useMutation(UpdateUserMutation);
  let variables = {
    where: {
      id: user.id,
    },
    data: {
      name: { set: name },
    },
  };
  if (twitter) {
    variables.data.twitter = { set: twitter };
  }
  if (website) {
    variables.data.website = { set: website };
  }
  if (institution) {
    variables.data.institution = { set: institution };
  }
  const handleUpdateUser = async () => {
    if (!imgRef.current) {
      await updateUser({
        variables,
      });
      Router.push(`/user/${user.id}`);
      return;
    }
    const img = await getCroppedImg(imgRef.current, crop, "hello");
    const { uploadTask, refPath } = uploadFile(
      img,
      UploadTypeEnum.PROFILE_IMAGE
    );
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {},
      async () => {
        variables.data.profilePictureUrl = { set: refPath };
        await updateUser({
          variables,
        });
        Router.push(`/user/${user.id}`);
      }
    );
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Edit Your Profile</Typography>
      </Grid>
      <Grid item container sm={3} spacing={3}>
        <Grid item>
          {profilePictureUrl ? (
            <ReactCrop
              src={profilePictureUrl}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onImageLoaded={onLoad}
            />
          ) : (
            <Dropzone
              onDrop={(acceptedFiles) => {
                setProfilePictureUrl(URL.createObjectURL(acceptedFiles[0]));
              }}
              accept={["image/png", "image/jpeg"]}
            >
              {({ getRootProps, getInputProps }) => (
                <Box
                  {...getRootProps()}
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                    borderRadius: "4px",
                    borderStyle: "dashed",
                    padding: 1,
                    height: "150px",
                  }}
                >
                  <input {...getInputProps()} />
                  <p>
                    (Optional) Drag and drop a logo image here, or click to
                    select file.
                  </p>
                </Box>
              )}
            </Dropzone>
          )}
        </Grid>
        <Grid item>
          <TextField
            required
            value={name}
            fullWidth
            variant="outlined"
            label="Name"
            onChange={(event) => setName(event.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            value={website}
            fullWidth
            variant="outlined"
            label="Website"
            onChange={(event) => setWebsite(event.target.value)}
          />
        </Grid>
        <Grid item>
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
      <Grid item xs={12}>
        <Typography variant="h5">Relations</Typography>
      </Grid>
      <Relations userId={user.id} relations={user.relations} />
    </Grid>
  );
}

function EditProfile({ id }) {
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { where: { id } },
  });
  if (loading) {
    return <Spinner />;
  } else if (error) {
    return <Error>Error loading profile information.</Error>;
  }
  return <Editor user={data.user} />;
}

function RetrieveAndEditProfile() {
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

  return (
    <Layout>
      <EditProfile id={user.uid} />
    </Layout>
  );
}

export default withApollo(RetrieveAndEditProfile);
