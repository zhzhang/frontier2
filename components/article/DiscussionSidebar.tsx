import { useRouter } from "next/router";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Comments from "./Comments";
import Reviews from "./Reviews";

const DiscussionSidebar = ({
  articleId,
  highlights,
  updateArticleAndScroll,
  articleVersion,
}) => {
  const router = useRouter();
  const view = router.query.view ? router.query.view : "review";
  return (
    <Tabs
      activeKey={view}
      onSelect={(newTabKey) => {
        router.query.view = newTabKey;
        router.push(router, undefined, { shallow: true });
      }}
    >
      <Tab eventKey="review" title="Reviews">
        <div className="mt-2">
          <Reviews
            articleId={articleId}
            articleVersion={articleVersion}
            highlights={highlights}
            updateArticleAndScroll={updateArticleAndScroll}
          />
        </div>
      </Tab>
      <Tab eventKey="comments" title="Comments">
        <div className="mt-2">
          <Comments
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
