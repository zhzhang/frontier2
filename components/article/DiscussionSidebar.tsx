import Decison from "@/components/article/Decision";
import CenteredSpinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import Review from "@/components/Review";
import Thread from "@/components/Thread";
import { apolloClient } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import _ from "lodash";
import { useState } from "react";
import MarkdownEditor from "../MarkdownEditor";
import {
  DeleteOneThreadMessage,
  PublishThreadMessage,
  THREAD_MESSAGE_FIELDS,
  UpdateThreadMessage,
} from "../Thread";
import Comment from "./Comment";
import {
  addHighlightVar,
  focusedEditorVar,
  highlightsVar,
  updateArticleAndScroll,
} from "./vars";

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

const DraftMessagesQuery = gql`
  ${THREAD_MESSAGE_FIELDS}
  query DraftMessageQuery($userId: String!, $articleId: String!) {
    draftMessage(userId: $userId, articleId: $articleId, headId: null) {
      ...ThreadMessageFields
    }
    focusedEditor @client
  }
`;

const CreateThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation createOneThreadMessage($data: ThreadMessageCreateInput!) {
    createOneThreadMessage(data: $data) {
      ...ThreadMessageFields
    }
  }
`;

function NewThreadPrompt({ userId, articleId }) {
  const [type, setType] = useState("COMMENT");
  const [createThreadMessage, { loading, error, data }] =
    useMutation(CreateThreadMessage);
  return (
    <Card sx={{ p: 1 }}>
      <Typography component="span">Write a </Typography>
      <FormControl variant="standard">
        <Select
          value={type}
          size="small"
          onChange={({ target: { value } }) => setType(value)}
        >
          <MenuItem value={"COMMENT"}>Comment</MenuItem>
          <MenuItem value={"REVIEW"}>Review</MenuItem>
        </Select>
      </FormControl>
      <Button
        size="small"
        onClick={async () => {
          const resp = await createThreadMessage({
            variables: {
              data: {
                type,
                body: "",
                highlights: [],
                article: {
                  connect: {
                    id: articleId,
                  },
                },
                author: {
                  connect: {
                    id: userId,
                  },
                },
              },
            },
          });
          apolloClient.writeQuery({
            query: DraftMessagesQuery,
            variables: {
              userId,
              articleId,
            },
            data: {
              draftMessage: resp.data.createOneThreadMessage,
            },
          });
        }}
      >
        Begin
      </Button>
    </Card>
  );
}

function NewThread({ userId, articleId }) {
  const variables = {
    userId,
    articleId,
  };
  const { loading, error, data } = useQuery(DraftMessagesQuery, {
    variables,
  });
  const [updateThreadMessage, updateResp] = useMutation(UpdateThreadMessage);
  const [deleteThread, deleteResp] = useMutation(DeleteOneThreadMessage);
  const [publishMessage, publishResp] = useMutation(PublishThreadMessage, {
    update(cache, { data: { publishMessage } }) {
      const variables = {
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
      };
      const { threadMessages } = cache.readQuery({
        query: ThreadMessagesQuery,
        variables,
      });
      cache.writeQuery({
        query: ThreadMessagesQuery,
        variables,
        data: {
          threadMessages: [publishMessage, ...threadMessages],
        },
      });
      cache.writeQuery({
        query: DraftMessagesQuery,
        variables: {
          userId,
          articleId,
        },
        data: {
          draftMessage: null,
        },
      });
    },
  });
  if (loading) {
    return <>Loading</>;
  }
  if (error) {
    return <>Error</>;
  }
  if (!data.draftMessage) {
    return <NewThreadPrompt userId={userId} articleId={articleId} />;
  }

  const message = data.draftMessage
    ? data.draftMessage
    : {
        id: "new",
        type: "COMMENT",
        body: "",
        highlights: [],
        __typename: "ThreadMessage",
      };

  const update = (message) => {
    updateThreadMessage({
      variables: {
        where: {
          id: message.id,
        },
        data: {
          type: {
            set: message.type,
          },
          body: {
            set: message.body,
          },
          highlights: message.highlights,
        },
      },
      context: {
        debounceTimeout: 1000,
        debounceKey: message.id,
      },
    });
    apolloClient.writeQuery({
      query: DraftMessagesQuery,
      variables,
      data: {
        draftMessage: message,
      },
    });
  };
  const addHighlight = (highlight) => {
    const data = apolloClient.readQuery({
      query: DraftMessagesQuery,
      variables,
    });
    const message = data.draftMessage;
    const highlights = [...message.highlights, highlight];
    highlightsVar(highlights);
    update({ ...message, highlights });
  };
  const deleteHighlight = (id: number) => {
    update({
      ...message,
      highlights: _.reject(message.highlights, { id }),
    });
  };
  return (
    <Box>
      <MarkdownEditor
        articleMode
        body={message.body}
        highlights={message.highlights}
        deleteHighlight={deleteHighlight}
        focused={
          data.focusedEditor === message.id || data.focusedEditor === "new"
        }
        onFocus={() => {
          focusedEditorVar(message.id);
          highlightsVar(message.highlights);
          addHighlightVar(addHighlight);
        }}
        onChange={(body) => {
          update({ ...message, body });
        }}
        updateArticleAndScroll={updateArticleAndScroll}
        placeholder={`Write a ${message.type.toLowerCase()}!`}
        sx={{ mt: 1 }}
      />
      <div style={{ textAlign: "right" }}>
        <Button
          onClick={() =>
            publishMessage({
              variables: {
                id: message.id,
              },
            })
          }
        >
          Publish
        </Button>
        <Button
          color="error"
          onClick={async () => {
            await deleteThread({
              variables: {
                where: {
                  id: message.id,
                },
              },
            });
            apolloClient.writeQuery({
              query: DraftMessagesQuery,
              variables,
              data: {
                draftMessage: null,
              },
            });
          }}
        >
          Delete
        </Button>
      </div>
    </Box>
  );
}

function AuthenticatedNewThread({ articleId }) {
  const { loading, user } = useAuth();
  if (loading) {
    return null;
  }
  if (!user) {
    return <>Log in to comment</>;
  }
  return <NewThread userId={user.uid} articleId={articleId} />;
}

function RenderRoot({ message, articleId }) {
  switch (message.type) {
    case "REVIEW":
      return <Review review={message} articleId={articleId} />;
    case "DECISION":
      return <Decison decision={message} articleId={articleId} />;
    default:
      return <Comment message={message} articleId={articleId} />;
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

  return (
    <Box sx={{ width: "100%" }}>
      <AuthenticatedNewThread articleId={articleId} />
      {data.threadMessages.map((message) => (
        <Box key={message.id}>
          <RenderRoot message={message} articleId={articleId} />
          <Thread headId={message.id} articleId={articleId} />
        </Box>
      ))}
    </Box>
  );
}

export default DiscussionSidebar;
