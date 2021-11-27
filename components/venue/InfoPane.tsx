import Markdown from "@/components/Markdown";
import { Grid } from "@mui/material";
import VenueDatesBar from "../VenueDatesBar";

const InfoPane = ({ venue }) => {
  const { description } = venue;
  return (
    <Grid
      container
      spacing={2}
      sx={{
        pt: 1,
      }}
    >
      <Grid item>
        <VenueDatesBar venue={venue} />
        <Markdown>{description}</Markdown>
      </Grid>
    </Grid>
  );
};

export default InfoPane;
