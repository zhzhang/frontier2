import ErrorSnackbar from "@/components/ErrorSnackbar";
import Layout from "@/components/Layout";
import MarkdownEditor from "@/components/MarkdownEditor";
import PdfViewer from "@/components/PDFViewer";
import SubmissionTargetTypeahed from "@/components/SubmissionTargetTypeahead";
import { USER_CARD_FIELDS } from "@/components/UserCard";
import UserTypeahead from "@/components/UserTypeahead";
import { withApollo } from "@/lib/apollo";
import { uploadFile } from "@/lib/firebase";
import { UploadTypeEnum } from "@/lib/types";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/react-hooks";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useState } from "react";
import Dropzone from "react-dropzone";

const CreateArticleMutation = gql`
  mutation CreateArticleQuery(
    $title: String!
    $abstract: String!
    $anonymous: Boolean!
    $authorIds: [String!]!
    $ref: String!
    $venueId: String
  ) {
    createArticle(
      title: $title
      abstract: $abstract
      anonymous: $anonymous
      authorIds: $authorIds
      ref: $ref
      venueId: $venueId
    ) {
      id
    }
  }
`;

const ArticleQuery = gql`
  ${USER_CARD_FIELDS}
  query ArticleQuery($id: String!) {
    article(where: { id: $id }) {
      id
      title
      abstract
      anonymous
      authors {
        number
        user {
          ...UserCardFields
        }
      }
      versions {
        id
        ref
        versionNumber
        createdAt
      }
    }
  }
`;

function RequestReviews({ article }) {
  const [submissionTarget, setSubmissionTarget] = useState(null);
  return (
    <>
      <SubmissionTargetTypeahed
        sx={{ mb: 2, mt: 2 }}
        label="Request review by..."
        onChange={(_, selected) => {
          console.log(selected);
          setSubmissionTarget(selected);
        }}
        value={submissionTarget}
      />
      {article.anonymous && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSubmit()}
          sx={{ mr: 2, mt: 2 }}
        >
          Request
        </Button>
      )}
    </>
  );
}

function ManageArticle({ article }) {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [title, setTitle] = useState(article.title);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [abstract, setAbstract] = useState(article.abstract);
  const [authors, setAuthors] = useState([]);
  const [createArticle, _] = useMutation(CreateArticleMutation);

  const handleSubmit = () => {
    const { uploadTask, refPath } = uploadFile(file, UploadTypeEnum.ARTICLE);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploadProgress(
          (100 * snapshot.bytesTransferred) / snapshot.totalBytes
        );
      },
      (error) => {
        setErrorMessage(error);
      },
      async () => {
        setUploadProgress(0);
        try {
          const { data } = await createArticle({
            variables: {
              title,
              abstract,
              ref: refPath,
              authorIds: authors.map((a) => a.id),
            },
          });
          window.location.href = `/article/${data.createArticle.id}`;
        } catch (error) {
          setErrorMessage(error.message);
        }
      }
    );
  };

  const canSubmit =
    authors.length > 0 && abstract.length > 0 && title.length > 0 && file;

  return (
    <Layout>
      <ErrorSnackbar error={errorMessage} />
      <Grid container spacing={3}>
        <Grid item xs={5}>
          <Box sx={{ display: "flex" }}>
            <Typography variant="h4" sx={{ flex: 1 }}>
              New Article Version
            </Typography>
            {file && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setFile(null)}
                size="small"
              >
                Choose Different PDF
              </Button>
            )}
          </Box>
          <TextField
            required
            fullWidth
            variant="outlined"
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            sx={{ mt: 2 }}
          />
          <UserTypeahead
            sx={{ mt: 2 }}
            label="Authors (In Order)"
            multiple
            value={authors}
            onChange={(_, selected) => {
              setAuthors(selected);
            }}
          />
          <MarkdownEditor
            body={abstract}
            onChange={(abstract) => setAbstract(abstract)}
            label="Abstract"
            placeholder="Abstract"
            sx={{
              mt: 2,
            }}
          />
          <Box sx={{ display: "flex", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              disabled={!canSubmit}
              sx={{ mr: 2, mt: 2 }}
            >
              Publish New Version
            </Button>
            <CircularProgress variant="determinate" value={uploadProgress} />
          </Box>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Typography variant="h4" sx={{ flex: 1 }}>
            Request Review
          </Typography>
          <RequestReviews article={article} />
          <Typography variant="h4" sx={{ flex: 1 }}>
            Additional Actions
          </Typography>
          {article.anonymous && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              sx={{ mr: 2, mt: 2 }}
            >
              Deanonymize
            </Button>
          )}
        </Grid>
        <Grid item xs={7}>
          {file ? (
            <Box sx={{ height: 600 }}>
              <PdfViewer file={file} />
            </Box>
          ) : (
            <Dropzone
              onDrop={(acceptedFiles) => {
                const reader = new FileReader();
                reader.readAsArrayBuffer(acceptedFiles[0]);
                reader.onload = () => {
                  setFile(reader.result);
                };
              }}
              accept={["application/pdf"]}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                    borderRadius: "4px",
                    borderStyle: "dashed",
                    padding: 8,
                    height: "302px",
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography>
                    Drag and drop a PDF file here, or click to select PDF file.
                  </Typography>
                </div>
              )}
            </Dropzone>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}

function LoadArticle() {
  const { id, reviewId, version } = useRouter().query;
  const { loading, error, data } = useQuery(ArticleQuery, {
    variables: { id },
  });
  if (loading || error) {
    return null;
  }
  return <ManageArticle article={data.article} />;
}

export default withApollo(LoadArticle);
