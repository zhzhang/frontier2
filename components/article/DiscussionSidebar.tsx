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
  const view = router.query.view ? router.query.view : "reviews";
  return (
    <Tabs
      activeKey={view}
      onSelect={(newTabKey) => {
        router.query.view = newTabKey;
        router.push(router, undefined, { shallow: true });
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
          <Reviews
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
