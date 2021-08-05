import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { useRouter } from "next/router";
import { useState } from "react";
import Decisions from "./Decisions";
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
}) => {
  const classes = useStyles();
  const router = useRouter();
  const reviewId = router.query.reviewId;
  const [view, setView] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setView(newValue);
  };

  const Body = () => {
    switch (view) {
      case 1:
        return (
          <Decisions
            articleId={articleId}
            articleVersion={articleVersion}
            highlights={highlights}
            updateArticleAndScroll={updateArticleAndScroll}
          />
        );
      default:
        return (
          <Reviews
            articleId={articleId}
            articleVersion={articleVersion}
            highlights={highlights}
            updateArticleAndScroll={updateArticleAndScroll}
          />
        );
    }
  };
  return (
    <div className={classes.margin}>
      <Tabs
        value={view}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
        variant="fullWidth"
      >
        <Tab label="Reviews" />
        <Tab label="Discussion" />
      </Tabs>
      <div className={classes.margin}>
        <Body />
      </div>
    </div>
  );
  // <LinkedReview
  //   articleId={articleId}
  //   articleVersion={articleVersion}
  //   highlights={highlights}
  //   updateArticleAndScroll={updateArticleAndScroll}
  //   reviewId={reviewId}
  // />
};

export default DiscussionSidebar;
