import { objectType } from "nexus";

const Decision = objectType({
  name: "Decision",
  definition(t) {
    t.model.id();
    t.model.body();
    t.model.author();
    t.model.article();
    t.list.field("citedReviews", { type: "Review" });
  },
});

export default Decision;
