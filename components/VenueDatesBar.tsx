import EventIcon from "@mui/icons-material/Event";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import dateformat from "dateformat";
import { useRouter } from "next/router";

function HeaderItem(props) {
  return <Box component="span" sx={{ mr: 2 }} {...props} />;
}

export default function VenueDatesBar({ venue }) {
  const router = useRouter();
  const { id, venueDate, websiteUrl, submissionOpen, submissionDeadline } =
    venue;
  const canSubmit =
    !submissionDeadline || new Date(submissionDeadline) > new Date(Date.now());
  const iconSx = { height: 18 };
  const headerItemSx = {
    mr: 2,
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {venueDate && (
        <HeaderItem>
          <EventIcon sx={{ iconSx }} />
          {dateformat(venueDate, "longDate")}
        </HeaderItem>
      )}
      <HeaderItem>
        <OpenInNewIcon sx={iconSx} />
        <Link href={websiteUrl} target="_blank">
          {websiteUrl}
        </Link>
      </HeaderItem>
      {submissionOpen && (
        <HeaderItem>
          <EventAvailableIcon sx={iconSx} />
          {`Submissions Open: ${dateformat(submissionOpen, "longDate")} `}
        </HeaderItem>
      )}
      {submissionDeadline && (
        <HeaderItem>
          <EventAvailableIcon sx={iconSx} />
          {`Submissions Deadline: ${dateformat(
            submissionDeadline,
            "longDate"
          )}`}
        </HeaderItem>
      )}
      {canSubmit && (
        <Button
          color="primary"
          size="small"
          variant="outlined"
          onClick={() => router.push(`/new-article?venue=${id}`)}
        >
          Submit
        </Button>
      )}
    </Box>
  );
}
