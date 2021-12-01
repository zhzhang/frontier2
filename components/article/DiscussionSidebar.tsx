import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";
import Comments from "./Comments";
import Reviews from "./Reviews";

function DiscussionSidebar() {
  const router = useRouter();
  const view = router.query.view ? router.query.view : "reviews";
  const handleChange = (_, newValue: string) => {
    router.query.view = newValue;
    router.push(router, undefined, { shallow: true });
  };

  const contentSx = {
    padding: 0,
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
