import Decison from "@/components/article/Decision";
import CenteredSpinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import Review from "@/components/Review";
import Thread from "@/components/Thread";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import gql from "graphql-tag";
import { THREAD_MESSAGE_FIELDS } from "../Thread";
import Comment from "./Comment";

const ThreadMessagesQuery = gql`
  ${THREAD_MESSAGE_FIELDS}
  query ThreadMessages(
    $where: ThreadMessageWhereInput!
    $orderBy: [ThreadMessageOrderByInput!]
  ) {
    threadMessages(where: $where, orderBy: $orderBy) {
      ...ThreadMessageFields
    }
    article @client
  }
`;

function RenderRoot({ message }) {
  switch (message.type) {
    case "REVIEW":
      return <Review review={message} />;
    case "DECISION":
      return <Decison decision={message} />;
    default:
      return <Comment comment={message} />;
  }
}

function DiscussionSidebar({ articleId }) {
  const { loading, error, data } = useQuery(ThreadMessagesQuery, {
    variables: {
      where: {
        articleId: { equals: articleId },
        headId: { equals: null },
        published: { equals: true },
        released: { equals: true },
      },
      orderBy: [
        {
          publishTimestamp: "desc",
        },
      ],
    },
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
        <Box key={message.id}>
          <RenderRoot message={message} />
          <Thread headId={message.id} />
        </Box>
      ))}
    </Box>
  );
}

export default DiscussionSidebar;
