import { serialize } from "@/components/editor/Editor";
import Layout from "@/components/Layout";
import MarkdownEditor from "@/components/MarkdownEditor";
import PdfViewer from "@/components/PDFViewer";
import SubmissionTargetTypeahed from "@/components/SubmissionTargetTypeahead";
import UserTypeahead from "@/components/UserTypeahead";
import { withApollo } from "@/lib/apollo";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useState } from "react";
import Dropzone from "react-dropzone";

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
    marginTop: theme.spacing(2),
  },
  alert: {
    marginBottom: theme.spacing(2),
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
  const [abstract, setAbstract] = useState("");
  const [authors, setAuthors] = useState([]);
  const [anonymized, setAnonymized] = useState(true);
  const [createArticle, { loading, error, data }] = useMutation(
    CreateArticleMutation
  );

  const handleSubmit = () => {
    const refPath = "articles/ACL2020_SpeechScoring.pdf";
    createArticle({
      variables: {
        title,
        abstract: serialize(abstract),
        ref: refPath,
        authorIds: authors.map((a) => a.id),
      },
    });
    // const { uploadTask, refPath } = uploadFile(file, UploadTypeEnum.ARTICLE);
    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {},
    //   (error) => {},
    //   () => {
    //     createArticle({
    //       variables: {
    //         title,
    //         abstract: serialize(abstract),
    //         ref: refPath,
    //         authorIds: authors.map((a) => a.id),
    //       },
    //     });
    //   }
    // );
  };

  return (
    <Layout>
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
          <FormControlLabel
            control={
              <Checkbox
                checked={anonymized}
                onChange={() => setAnonymized(!anonymized)}
                name="anonymize"
              />
            }
            label="Anonymize Authors"
          />
          {!anonymized && (
            <div className={classes.alert}>
              <Alert severity="warning">
                Submitting without anonymization will disqualify this
                publication for review with many organizations and venues.
              </Alert>
            </div>
          )}
          <MarkdownEditor
            body={abstract}
            onChange={(abstract) => setAbstract(abstract)}
            label="Abstract"
            placeholder="Write an abstract."
          />
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
