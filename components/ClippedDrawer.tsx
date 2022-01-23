import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

export default function ClippedDrawer({ drawer, children }) {
  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: 300,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 300,
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            marginTop: "48px",
            height: "calc(100vh - 48px)",
          }}
        >
          {drawer}
        </Box>
      </Drawer>
      <Box sx={{ marginLeft: "300px" }}>{children}</Box>
    </>
  );
}
