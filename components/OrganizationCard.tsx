import FirebaseAvatar from "@/components/FirebaseAvatar";
import Markdown from "@/components/Markdown";
import { withApollo } from "@/lib/apollo";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
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

const OrganizationCard = ({ organization }) => {
  const { id, name, description, logoRef } = organization;
  const classes = useStyles();
  return (
    <Card>
      <CardContent>
        <div className={classes.header}>
          {logoRef === null ? (
            <Avatar variant="rounded">T</Avatar>
          ) : (
            <FirebaseAvatar storeRef={logoRef} variant="rounded" name={name} />
          )}
          <Typography variant="h5">
            <Link href={`/organization/${id}`} color="inherit">
              {name}
            </Link>
          </Typography>
        </div>
        <Markdown>{description}</Markdown>
      </CardContent>
    </Card>
  );
};

export default withApollo(OrganizationCard);
