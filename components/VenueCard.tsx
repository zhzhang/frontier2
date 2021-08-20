import FirebaseAvatar from "@/components/FirebaseAvatar";
import Markdown from "@/components/Markdown";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LinkIcon from "@material-ui/icons/Link";

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
}));

export default function VenueCard({ venue }) {
  const { id, name, description, logoRef, websiteUrl } = venue;
  const classes = useStyles();
  return (
    <>
      <div className={classes.header}>
        {logoRef === null ? (
          <Avatar variant="rounded">T</Avatar>
        ) : (
          <FirebaseAvatar storeRef={logoRef} variant="rounded" name={name} />
        )}
        <div>
          <Typography variant="h5" color="textSecondary">
            <Link href={`/organization/${id}`} color="inherit">
              {name}
            </Link>
          </Typography>
          <Typography>
            <LinkIcon />
            <Link href={websiteUrl}>{websiteUrl}</Link>
          </Typography>
        </div>
      </div>
      <Markdown>{description}</Markdown>
      <Button color="primary" variant="outlined">
        Submit
      </Button>
    </>
  );
}
