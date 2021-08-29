import Markdown from "@/components/Markdown";
import { Grid } from "@material-ui/core";
import EventIcon from "@material-ui/icons/Event";
import dateformat from "dateformat";

const InfoPane = ({ venue: { id, description, role, venueDate } }) => {
  return (
    <Grid container spacing={2}>
      <Grid item>
        <Markdown>{description}</Markdown>
        {venueDate && (
          <span>
            <EventIcon />
            {dateformat(venueDate, "longDate")}
          </span>
        )}
      </Grid>
    </Grid>
  );
};

export default InfoPane;
