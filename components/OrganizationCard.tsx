import FirebaseAvatar from "@/components/FirebaseAvatar";
import Markdown from "@/components/Markdown";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

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

export default function OrganizationCard({ organization }) {
  const { id, name, description, logoRef } = organization;
  const classes = useStyles();
  return (
    <>
      <div className={classes.header}>
        {logoRef === null ? (
          <Avatar variant="rounded">T</Avatar>
        ) : (
          <FirebaseAvatar storeRef={logoRef} variant="rounded" name={name} />
        )}
        <Typography variant="h4" color="textSecondary">
          <Link href={`/organization/${id}`} color="inherit">
            {name}
          </Link>
        </Typography>
      </div>
      <Markdown>{description}</Markdown>
      <Button color="primary" variant="outlined">
        Submit
      </Button>
      <Button color="primary" variant="outlined">
        View Venues
      </Button>
    </>
  );
}
