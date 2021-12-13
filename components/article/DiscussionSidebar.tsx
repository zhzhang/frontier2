import CenteredSpinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import gql from "graphql-tag";
import { THREAD_MESSAGE_FIELDS } from "../Thread";

const ThreadMessagesQuery = gql`
  ${THREAD_MESSAGE_FIELDS}
  query ThreadMessages($where: ReviewWhereInput!) {
    threadMessages(where: $where) {
      ...ThreadMessageFields
    }
    article @client
  }
`;

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

  return <Box sx={{ width: "100%" }}>tmp</Box>;
}

export default DiscussionSidebar;
