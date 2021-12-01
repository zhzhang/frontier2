import AuthorPopover from "@/components/AuthorPopover";
import CenteredSpinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import Markdown from "@/components/Markdown";
import ProfilePicturePopover from "@/components/ProfilePicturePopover";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import gql from "graphql-tag";
import { useState } from "react";

const ThreadMessagesQuery = gql`
  query ThreadMessagesQuery($where: ThreadMessageWhereInput!) {
    threadMessages(where: $where) {
      id
      author {
        name
      }
      body
      highlights
    }
  }
`;

export default function Thread({ headId }) {
  const [cursor, setCursor] = useState(null);
  const { loading, error, data } = useQuery(ThreadMessagesQuery, {
    variables: { where: { headId: { equals: headId } } },
  });
  if (loading) {
    return <CenteredSpinner />;
  }
  if (error) {
    return (
      <Box
        sx={{
          mt: 2,
          ml: 5, // Centers to the profile picture.
        }}
      >
        <Error>There was a problem loading replies to this thread.</Error>
      </Box>
    );
  }
  const { threadMessages } = data;
  return threadMessages.map((message) => (
    <Box
      key={message.id}
      sx={{
        display: "flex",
        ml: 3, // Centers to the profile picture.
        pl: 2,
      }}
    >
      <ProfilePicturePopover user={message.author} sx={{ mr: 1 }} />
      <Box>
        <AuthorPopover user={message.author} />
        <Markdown>{message.body}</Markdown>
      </Box>
    </Box>
  ));
}
