import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

export default function OrDivider({ sx = {} }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", ...sx }}>
      <Divider sx={{ flex: 1, mr: 1 }} />
      <Typography color="GrayText">or</Typography>
      <Divider sx={{ flex: 1, ml: 1 }} />
    </Box>
  );
}
