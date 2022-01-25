import Decison from "@/components/article/Decision";
import { Auth } from "@/components/Auth";
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
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import _ from "lodash";
import { useState } from "react";
import MarkdownEditor from "../MarkdownEditor";
import {
  DeleteThreadMessage,
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

const ThreadHeadsQuery = gql`
  ${THREAD_MESSAGE_FIELDS}
  query ThreadHeads($input: ThreadMessagesInput!) {
    threadMessages(input: $input) {
      ...ThreadMessageFields
    }
    article @client
  }
`;

const DraftMessagesQuery = gql`
  ${THREAD_MESSAGE_FIELDS}
  query DraftMessageQuery($articleId: String!) {
    draftMessage(articleId: $articleId, headId: null) {
      ...ThreadMessageFields
    }
    focusedEditor @client
  }
`;

const CreateThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation createThreadMessage($input: ThreadMessageCreateInput!) {
    createThreadMessage(input: $input) {
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
              input: {
                type,
                articleId,
              },
            },
          });
          apolloClient.refetchQueries({
            include: ["DraftMessageQuery"],
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
    articleId,
  };
  const { loading, error, data } = useQuery(DraftMessagesQuery, {
    variables,
  });
  const [updateThreadMessage, updateResp] = useMutation(UpdateThreadMessage);
  const [deleteThread, deleteResp] = useMutation(DeleteThreadMessage);
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
    return (
      <Typography variant="h1">{loading ? <Skeleton /> : "h1"}</Typography>
    );
  }
  if (error) {
    return <Error>Error checking for existing drafts.</Error>;
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
        input: {
          id: message.id,
          body: message.body,
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
                body: message.body,
                highlights: message.highlights,
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
                id: message.id,
              },
            });
            apolloClient.refetchQueries({
              include: ["DraftMessageQuery"],
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
  const [loginOpen, toggleLoginOpen] = useState(false);
  if (loading) {
    return null;
  }
  if (!user) {
    return (
      <Card sx={{ p: 1 }}>
        <Typography>
          <Link onClick={() => toggleLoginOpen(true)}>Log in</Link> to comment
        </Typography>
        <Dialog open={loginOpen} onClose={() => toggleLoginOpen(false)}>
          <Auth />
        </Dialog>
      </Card>
    );
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
  const { loading, error, data } = useQuery(ThreadHeadsQuery, {
    variables: {
      input: {
        articleId,
      },
    },
  });
  if (loading) {
    return <CenteredSpinner sx={{ mt: 2 }} />;
  }
  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <>
      <AuthenticatedNewThread articleId={articleId} />
      {data.threadMessages.map((message) => (
        <Box key={message.id}>
          <RenderRoot message={message} articleId={articleId} />
          <Thread headId={message.id} articleId={articleId} />
        </Box>
      ))}
    </>
  );
}

export default DiscussionSidebar;
