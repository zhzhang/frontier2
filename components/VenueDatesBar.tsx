import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import EventIcon from "@material-ui/icons/Event";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import dateformat from "dateformat";

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
  const { venueDate, websiteUrl, submissionOpen, submissionDeadline } = venue;
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
        <Button color="primary" size="small" variant="outlined">
          Submit
        </Button>
      )}
    </div>
  );
}
