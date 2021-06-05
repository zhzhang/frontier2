import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Decisions from "./Decisions";
import Reviews from "./Reviews";

const DiscussionSidebar = ({
  articleId,
  highlights,
  updateArticleAndScroll,
  articleVersion,
}) => {
  const [view, setView] = useState("reviews");
  return (
    <Tabs
      activeKey={view}
      onSelect={(newTabKey) => {
        setView(newTabKey);
      }}
    >
      <Tab eventKey="reviews" title="Reviews">
        <div className="mt-2">
          <Reviews
            articleId={articleId}
            articleVersion={articleVersion}
            highlights={highlights}
            updateArticleAndScroll={updateArticleAndScroll}
          />
        </div>
      </Tab>
      <Tab eventKey="decisions" title="Decisions">
        <div className="mt-2">
          <Decisions
            articleId={articleId}
            articleVersion={articleVersion}
            highlights={highlights}
            updateArticleAndScroll={updateArticleAndScroll}
          />
        </div>
      </Tab>
    </Tabs>
  );
};

export default DiscussionSidebar;
