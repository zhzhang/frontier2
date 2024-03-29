import ErrorSnackbar from "@/components/ErrorSnackbar";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import MarkdownEditor from "@/components/MarkdownEditor";
import PdfViewer from "@/components/PDFViewer";
import SubmissionTargetTypeahed from "@/components/SubmissionTargetTypeahead";
import UserTypeahead from "@/components/UserTypeahead";
import { withApollo } from "@/lib/apollo";
import { uploadFile } from "@/lib/firebase";
import { UploadTypeEnum } from "@/lib/types";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
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

const VenueQuery = gql`
  query VenueQuery($where: VenueWhereUniqueInput!) {
    venue(where: $where) {
      id
      name
      abbreviation
      logoRef
      venueDate
    }
  }
`;

function NewArticle({ venue }) {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [title, setTitle] = useState("");
  const [submissionTarget, setSubmissionTarget] = useState(venue);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [abstract, setAbstract] = useState("");
  const [authors, setAuthors] = useState([]);
  const [anonymous, setAnonymous] = useState(true);
  const [createArticle, { error }] = useMutation(CreateArticleMutation);

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
              anonymous,
              ref: refPath,
              authorIds: authors.map((a) => a.id),
              venueId: submissionTarget && submissionTarget.id,
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
      <ErrorSnackbar error={error} />
      <Grid container spacing={3}>
        <Grid item xs={5}>
          <Box sx={{ display: "flex" }}>
            <Typography variant="h4" sx={{ flex: 1 }}>
              New Article
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
          <FormControlLabel
            control={
              <Checkbox
                checked={anonymous}
                onChange={() => setAnonymous(!anonymous)}
                name="anonymize"
              />
            }
            label="Anonymize Authors"
          />
          {!anonymous && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Submitting without anonymization will disqualify this publication
              for review with many venues.
            </Alert>
          )}
          <MarkdownEditor
            body={abstract}
            onChange={(abstract) => setAbstract(abstract)}
            label="Abstract"
            placeholder="Abstract"
            sx={{
              mb: 2,
            }}
          />
          <SubmissionTargetTypeahed
            sx={{ mb: 2, mt: 2 }}
            label="Request review by..."
            onChange={(_, selected) => {
              setSubmissionTarget(selected);
            }}
            value={submissionTarget}
          />
          <Box sx={{ display: "flex", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              disabled={!canSubmit}
              sx={{ mr: 2 }}
            >
              Publish
            </Button>
            <CircularProgress variant="determinate" value={uploadProgress} />
          </Box>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Grid>
        <Grid item xs={7}>
          {file ? (
            <Box sx={{ height: 600 }}>
              <PdfViewer
                file={file}
                sx={{ height: "calc(100vh - 120px)", overflow: "auto" }}
              />
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

function NewArticleWithVenue() {
  const router = useRouter();
  const { venue } = router.query;
  const { loading, error, data } = useQuery(VenueQuery, {
    variables: { where: { id: venue } },
  });

  if (venue) {
    if (loading) {
      return <Spinner />;
    }
  }
  return <NewArticle venue={data && data.venue} />;
}

export default withApollo(NewArticleWithVenue);
