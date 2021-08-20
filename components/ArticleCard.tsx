import AuthorPopover from "@/components/AuthorPopover";
import Markdown from "@/components/Markdown";
import OrganizationPopover from "@/components/OrganizationPopover";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

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

export default function ArticleCard({ article }) {
  const { id, title, versions, authors, acceptedVenues } = article;
  const classes = useStyles();
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
      <Markdown>{versions[0].abstract}</Markdown>
      <div>
        {acceptedVenues.length === 0 ? null : "Accepted by: "}
        {acceptedVenues.map((org) => (
          <OrganizationPopover organization={org} />
        ))}
      </div>
    </>
  );
}
