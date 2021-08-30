import Markdown from "@/components/Markdown";
import { Grid } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import VenueDatesBar from "../VenueDatesBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      paddingTop: theme.spacing(1),
    },
    icon: {
      height: `${theme.typography.fontSize}pt`,
    },
  })
);

const InfoPane = ({ venue }) => {
  const { description } = venue;
  const classes = useStyles();
  return (
    <Grid container spacing={2} className={classes.body}>
      <Grid item>
        <VenueDatesBar venue={venue} />
        <Markdown>{description}</Markdown>
      </Grid>
    </Grid>
  );
};

export default InfoPane;