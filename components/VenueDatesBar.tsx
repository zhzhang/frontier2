import EventIcon from "@mui/icons-material/Event";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import dateformat from "dateformat";
import { useRouter } from "next/router";

function HeaderItem(props) {
  return (
    <Box sx={{ display: "flex", mr: 2, alignItems: "center" }} {...props} />
  );
}

export default function VenueDatesBar({ venue }) {
  const router = useRouter();
  const { id, venueDate, websiteUrl, submissionOpen, submissionDeadline } =
    venue;
  const canSubmit =
    !submissionDeadline || new Date(submissionDeadline) > new Date(Date.now());
  const iconSx = { fontSize: "1.2rem", verticalAlign: "middle", mr: 0.3 };
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      {venueDate && (
        <HeaderItem>
          <EventIcon sx={iconSx} />
          <Typography>{dateformat(venueDate, "longDate")}</Typography>
        </HeaderItem>
      )}
      <HeaderItem>
        <OpenInNewIcon sx={iconSx} />
        <Link href={websiteUrl} target="_blank">
          <Typography component="span">{websiteUrl}</Typography>
        </Link>
      </HeaderItem>
      {submissionOpen && (
        <HeaderItem>
          <EventAvailableIcon sx={iconSx} />
          <Typography>
            {`Submissions Open: ${dateformat(submissionOpen, "longDate")} `}
          </Typography>
        </HeaderItem>
      )}
      {submissionDeadline && (
        <HeaderItem>
          <EventAvailableIcon sx={iconSx} />
          <Typography>
            {`Submissions Deadline: ${dateformat(
              submissionDeadline,
              "longDate"
            )}`}
          </Typography>
        </HeaderItem>
      )}
      {canSubmit && (
        <Button
          color="primary"
          size="small"
          variant="outlined"
          onClick={() => router.push(`/new-article?venue=${id}`)}
          sx={{ p: 0 }}
        >
          Request Review
        </Button>
      )}
    </Box>
  );
}
