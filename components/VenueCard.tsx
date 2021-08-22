import FirebaseAvatar from "@/components/FirebaseAvatar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import EventIcon from "@material-ui/icons/Event";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import LinkIcon from "@material-ui/icons/Link";
import dateformat from "dateformat";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  logo: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  headerItem: {
    marginRight: theme.spacing(2),
  },
}));

export default function VenueCard({ venue }) {
  const classes = useStyles();
  const {
    id,
    name,
    abbreviation,
    description,
    logoRef,
    websiteUrl,
    venueDate,
    submissionDeadline,
    submissionOpen,
  } = venue;

  const Header = () => {
    const parsedVenueDate = new Date(venueDate);
    let abbrev = abbreviation;
    if (venueDate) {
      abbrev += ` ${parsedVenueDate.getFullYear()}`;
    }
    abbrev += " - ";
    return (
      <Typography variant="h5" color="textSecondary">
        <Link href={`/venue/${id}`} color="inherit">
          {abbrev}
          {name}
        </Link>
      </Typography>
    );
  };

  const canSubmit =
    !submissionDeadline || new Date(submissionDeadline) > new Date(Date.now());

  const SubHeader = () => {
    return (
      <Typography>
        {venueDate && (
          <span className={classes.headerItem}>
            <EventIcon />
            {dateformat(venueDate, "longDate")}
          </span>
        )}
        <span className={classes.headerItem}>
          <LinkIcon />
          <Link href={websiteUrl}>{websiteUrl}</Link>
        </span>
        {submissionOpen && (
          <span className={classes.headerItem}>
            <EventAvailableIcon />
            {`Submissions Open: ${dateformat(submissionOpen, "longDate")} `}
          </span>
        )}
        {submissionDeadline && (
          <span className={classes.headerItem}>
            <EventAvailableIcon />
            {`Submissions Deadline: ${dateformat(
              submissionDeadline,
              "longDate"
            )}`}
          </span>
        )}
        {canSubmit && (
          <Button color="primary" size="small">
            Submit
          </Button>
        )}
      </Typography>
    );
  };
  return (
    <>
      <div className={classes.header}>
        {logoRef === null ? (
          <Avatar variant="rounded">T</Avatar>
        ) : (
          <FirebaseAvatar storeRef={logoRef} variant="rounded" name={name} />
        )}
        <div>
          <Header />
          <SubHeader />
        </div>
      </div>
      <Typography>{description}</Typography>
    </>
  );
}
