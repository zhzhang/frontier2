import Authors from "@/components/Authors";
import Markdown from "@/components/Markdown";
import VenuePopover from "@/components/VenuePopover";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

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

export default function ArticleCard({ article, className = null }) {
  const { id, title, versions, authors, acceptedVenues } = article;
  const classes = useStyles();
  return (
    <div className={className}>
      <a href={`/article/${id}`}>{title}</a>
      <Authors authors={authors} />
      <Markdown>{versions[0].abstract}</Markdown>
      <div>
        {acceptedVenues.length === 0 ? null : "Accepted by: "}
        {acceptedVenues.map((venue) => (
          <VenuePopover venue={venue} />
        ))}
      </div>
    </div>
  );
}
