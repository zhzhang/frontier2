import CenteredSpinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import gql from "graphql-tag";
import { THREAD_MESSAGE_FIELDS } from "../Thread";
import Comment from "./Comment";

const ThreadMessagesQuery = gql`
  ${THREAD_MESSAGE_FIELDS}
  query ThreadMessages($where: ThreadMessageWhereInput!) {
    threadMessages(where: $where) {
      ...ThreadMessageFields
    }
    article @client
  }
`;

function RenderRoot({ message }) {
  console.log(message);
  switch (message.type) {
    // case "REVIEW":
    //return <Review review={message} />;
    default:
      return <Comment comment={message} />;
  }
}

function DiscussionSidebar({ articleId }) {
  const { loading, error, data } = useQuery(ThreadMessagesQuery, {
    variables: { where: { articleId: { equals: articleId } } },
  });
  if (loading) {
    return <CenteredSpinner sx={{ mt: 2 }} />;
  }
  if (error) {
    return <Error>{error.message}</Error>;
  }
  const contentSx = {
    padding: 0,
  };

  return (
    <Box sx={{ width: "100%" }}>
      {data.threadMessages.map((message) => (
        <RenderRoot message={message} />
      ))}
    </Box>
  );
}

export default DiscussionSidebar;
