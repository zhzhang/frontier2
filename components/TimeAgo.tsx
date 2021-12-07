import Typography from "@mui/material/Typography";
import jsTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

jsTimeAgo.addDefaultLocale(en);

export default function TimeAgo({ time, ...props }) {
  const timeAgo = new jsTimeAgo("en-US");
  return <Typography {...props}>{timeAgo.format(new Date(time))}</Typography>;
}
