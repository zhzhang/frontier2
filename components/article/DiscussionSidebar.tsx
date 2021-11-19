import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { useState } from "react";
import Comments from "./Comments";
import Reviews from "./Reviews";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginTop: theme.spacing(1),
    },
  })
);

const DiscussionSidebar = ({
  articleId,
  highlights,
  updateArticleAndScroll,
  articleVersion,
  setAddHighlight,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const reviewId = router.query.reviewId;
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
          <Reviews
            key="reviews"
            articleId={articleId}
            articleVersion={articleVersion}
            setAddHighlight={setAddHighlight}
            updateArticleAndScroll={updateArticleAndScroll}
          />
        </TabPanel>
        <TabPanel value="discussion" sx={contentSx}>
          <Comments
            articleId={articleId}
            articleVersion={articleVersion}
            highlights={highlights}
            updateArticleAndScroll={updateArticleAndScroll}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default DiscussionSidebar;
