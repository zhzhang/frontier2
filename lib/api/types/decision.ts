import { objectType } from "nexus";

const Decision = objectType({
  name: "Decision",
  definition(t) {
    t.string("id");
    t.string("body");
    t.boolean("decision");
    t.field("author", { type: "User" });
    t.field("article", { type: "Article" });
    t.field("organization", { type: "Organization" });
    t.list.field("citedReviews", { type: "Review" });
  },
});

export default Decision;
