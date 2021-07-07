import Editor, { newEditorState, serialize } from "@/components/editor/Editor";
import Layout from "@/components/Layout";
import PdfViewer from "@/components/PDFViewer";
import SubmissionTargetTypeahed from "@/components/SubmissionTargetTypeahead";
import UserTypeahead from "@/components/UserTypeahead";
import { withApollo } from "@/lib/apollo";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { uploadFile } from "../lib/firebase";
import { UploadTypeEnum } from "../lib/types";

const CreateArticleMutation = gql`
  mutation CreateArticleQuery(
    $title: String!
    $abstract: String!
    $authorIds: [String!]!
    $ref: String!
  ) {
    createArticle(
      title: $title
      abstract: $abstract
      authorIds: $authorIds
      ref: $ref
    ) {
      id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  formField: {
    paddingTop: theme.spacing(2),
  },
  dropzone: {
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    borderStyle: "dashed",
    padding: theme.spacing(1),
    height: "302px",
  },
}));

const NewArticle = () => {
  const classes = useStyles();
  const router = useRouter();
  const { organizationId } = router.query;
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [submissionTargets, setSubmissionTargets] = useState([]);
  const [abstract, setAbstract] = useState(newEditorState());
  const [authors, setAuthors] = useState([]);
  const [createArticle, { loading, error, data }] = useMutation(
    CreateArticleMutation
  );

  const handleSubmit = () => {
    const { uploadTask, refPath } = uploadFile(file, UploadTypeEnum.ARTICLE);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {},
      () => {
        createArticle({
          variables: {
            title,
            abstract: serialize(abstract),
            ref: refPath,
            authorIds: authors.map((a) => a.id),
          },
        });
      }
    );
  };

  return (
    <Layout padded>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">New Article</Typography>
        </Grid>
        <Grid item xs={5}>
          <TextField
            required
            fullWidth
            variant="outlined"
            label="Title"
            onChange={(event) => setTitle(event.target.value)}
          />
          <UserTypeahead
            className={classes.formField}
            label="Authors"
            multiple
            value={authors}
            onChange={(_, selected) => {
              setAuthors(selected);
            }}
          />
          <div className={classes.formField}>
            <Editor
              placeholder={"Write an abstract."}
              editorState={abstract}
              onChange={(editorState) => setAbstract(editorState)}
            />
          </div>
          <SubmissionTargetTypeahed
            className={classes.formField}
            label="Submit to..."
            multiple
            onChange={(_, selected) => {
              setSubmissionTargets(selected);
            }}
            value={submissionTargets}
          />
          <div className={classes.formField}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          </div>
        </Grid>
        <Grid item xs={7}>
          {file ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setFile(null)}
              >
                Choose Different PDF
              </Button>
              <PdfViewer file={file} />
            </>
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
                <div {...getRootProps()} className={classes.dropzone}>
                  <input {...getInputProps()} />
                  <p>
                    Drag and drop a PDF file here, or click to select PDF file.
                  </p>
                </div>
              )}
            </Dropzone>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default withApollo(NewArticle);
