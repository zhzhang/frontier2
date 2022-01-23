import Error from "@/components/Error";
import { USER_CARD_FIELDS } from "@/components/UserCard";
import { useMutation } from "@apollo/react-hooks";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";

const UpdateUserMutation = gql`
  ${USER_CARD_FIELDS}
  mutation UpdateUser($input: UserUpdateInput!) {
    updateUser(input: $input) {
      ...UserCardFields
    }
  }
`;

export default function Editor({ user }) {
  const [name, setName] = useState(user.name);
  const [website, setWebsite] = useState(user.website || "");
  const [institution, setInstitution] = useState(user.institution || "");
  const [twitter, setTwitter] = useState(user.twitter || "");
  const [updateUser, { error }] = useMutation(UpdateUserMutation);
  const handleUpdateUser = () => {
    updateUser({
      variables: {
        input: {
          id: user.id,
          name,
          website,
          institution,
          twitter,
        },
      },
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">Edit Profile</Typography>
      </Grid>
      <Grid item container sm={6} spacing={3}>
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
        <Grid item xs={12}>
          <TextField
            value={twitter}
            fullWidth
            variant="outlined"
            label="Twitter Handle"
            onChange={(event) => setTwitter(event.target.value)}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateUser}
          disabled={name.length === 0}
        >
          Save
        </Button>
      </Grid>
      <Grid item xs={12}>
        {error && <Error>{error.message}</Error>}
      </Grid>
    </Grid>
  );
}
