import FirebaseAvatar from "@/components/FirebaseAvatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";

export const USER_CARD_FIELDS = gql`
  fragment UserCardFields on User {
    id
    name
    profilePictureUrl
    twitter
    website
    institution
  }
`;

export default function UserCard({ user }) {
  const { profilePictureUrl, name } = user;
  return (
    <Box
      sx={{
        display: "flex",
        p: 1,
      }}
    >
      <FirebaseAvatar name={name} storeRef={profilePictureUrl} />
      <Typography
        variant="h6"
        sx={{
          p: 1,
        }}
      >
        {name}
      </Typography>
    </Box>
  );
}
