import Tab from "@material-ui/core/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { useState } from "react";
import Comments from "./Comments";
import Reviews from "./Reviews";

function DiscussionSidebar({ articleVersion }) {
  const router = useRouter();
  const [view, setView] = useState("reviews");

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setView(newValue);
  };

  const contentSx = {
    paddingTop: "theme.spacing(2)",
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
  };

  return (
    <Box sx={{ width: "100%" }}>
      <TabContext value={view}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            value={view}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example"
            variant="fullWidth"
          >
            <Tab label="Reviews" value="reviews" />
            <Tab label="Discussion" value="discussion" />
          </TabList>
        </Box>
        <TabPanel value="reviews" sx={contentSx}>
          <Reviews />
        </TabPanel>
        <TabPanel value="discussion" sx={contentSx}>
          <Comments />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default DiscussionSidebar;
