import AuthorPopover from "@/components/AuthorPopover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Authors({ authors, sx = null, ...props }) {
  if (authors === null) {
    return (
      <Box sx={sx}>
        <Typography>
          <em>Anonymized</em>
        </Typography>
      </Box>
    );
  }
  const children = [];
  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];
    children.push(
      <AuthorPopover identity={author} key={author.number} {...props} />
    );
    if (i < authors.length - 1) {
      children.push(", ");
    }
  }

  return <Box sx={sx}>{children}</Box>;
}
