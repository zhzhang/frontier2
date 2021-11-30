import AuthorPopover from "@/components/AuthorPopover";
import CenteredSpinner from "@/components/CenteredSpinner";
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
  const { threadMessages } = data;
  return (
    <div>
      {threadMessages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: "flex",
            mt: 2,
            marginLeft: 20, // Centers to the profile picture.
            paddingLeft: 20,
          }}
        >
          <ProfilePicturePopover user={message.author} />
          <Box>
            <AuthorPopover user={message.author} />
            <Markdown>{message.body}</Markdown>
          </Box>
        </Box>
      ))}
    </div>
  );
}
