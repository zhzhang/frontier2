import AuthorPopover from "@/components/AuthorPopover";
import Editor, { deserialize } from "@/components/editor/Editor";
import OrganizationPopover from "@/components/OrganizationPopover";
import { withApollo } from "@/lib/apollo";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chips: {
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
  })
);

function ArticleCard({ article }) {
  const { id, title, versions, authors, acceptedOrganizations } = article;
  const classes = useStyles();
  const [abstract, setAbstract] = useState(deserialize(versions[0].abstract));
  return (
    <>
      <a href={`/article/${id}`}>{title}</a>
      <div className={classes.chips}>
        {authors !== null ? (
          authors.map((author) => <AuthorPopover user={author} />)
        ) : (
          <Typography color="textSecondary">
            <em>Anonymized</em>
          </Typography>
        )}
      </div>
      <Editor
        placeholder={"Write an abstract."}
        editorState={abstract}
        onChange={(editorState) => setAbstract(editorState)}
      />
      <div>
        {acceptedOrganizations.length === 0 ? null : "Accepted by: "}
        {acceptedOrganizations.map((org) => (
          <OrganizationPopover organization={org} />
        ))}
      </div>
    </>
  );
}

export default withApollo(ArticleCard);
