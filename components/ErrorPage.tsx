import Error from "@/components/Error";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(4),
  },
}));

export default function ErrorPage(props) {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Error {...props} />
    </div>
  );
}
