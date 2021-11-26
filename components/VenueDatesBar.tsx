import EventIcon from "@material-ui/icons/Event";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { createStyles, makeStyles, Theme } from "@mui/material/styles";
import dateformat from "dateformat";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerItem: {
      marginRight: theme.spacing(2),
    },
    icon: {
      height: 18,
    },
    container: {
      display: "flex",
      alignItems: "center",
    },
  })
);

export default function VenueDatesBar({ venue }) {
  const classes = useStyles();
  const router = useRouter();
  const { id, venueDate, websiteUrl, submissionOpen, submissionDeadline } =
    venue;
  const canSubmit =
    !submissionDeadline || new Date(submissionDeadline) > new Date(Date.now());
  return (
    <div className={classes.container}>
      {venueDate && (
        <span className={classes.headerItem}>
          <EventIcon className={classes.icon} />
          {dateformat(venueDate, "longDate")}
        </span>
      )}
      <span className={classes.headerItem}>
        <OpenInNewIcon className={classes.icon} />
        <Link href={websiteUrl} target="_blank">
          {websiteUrl}
        </Link>
      </span>
      {submissionOpen && (
        <span className={classes.headerItem}>
          <EventAvailableIcon className={classes.icon} />
          {`Submissions Open: ${dateformat(submissionOpen, "longDate")} `}
        </span>
      )}
      {submissionDeadline && (
        <span className={classes.headerItem}>
          <EventAvailableIcon className={classes.icon} />
          {`Submissions Deadline: ${dateformat(
            submissionDeadline,
            "longDate"
          )}`}
        </span>
      )}
      {canSubmit && (
        <Button
          color="primary"
          size="small"
          variant="outlined"
          onClick={() => router.push(`/new-article?venue=${id}`)}
        >
          Submit
        </Button>
      )}
    </div>
  );
}
