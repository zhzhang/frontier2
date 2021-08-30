import FirebaseAvatar from "@/components/FirebaseAvatar";
import VenueDatesBar from "@/components/VenueDatesBar";
import Avatar from "@material-ui/core/Avatar";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

export default function VenueCard({ venue }) {
  const classes = useStyles();
  const { id, name, abbreviation, logoRef, venueDate, submissionDeadline } =
    venue;

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
          <VenueDatesBar venue={venue} />
        </div>
      </div>
      {/* <Typography>{description}</Typography> */}
    </>
  );
}
