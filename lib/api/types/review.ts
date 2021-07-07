import { objectType } from "nexus";

const Review = objectType({
  name: "Review",
  definition(t) {
    t.string("id");
    t.string("body");
    t.string("highlights");
    t.int("rating");
    t.int("reviewNumber");
    t.int("articleVersion");
    t.boolean("published");
    t.boolean("canAccess");
    t.field("author", { type: "User" });
    t.field("submission", { type: "Submission" });
    t.field("organization", { type: "Organization" });
    t.list.field("threadMessages", {
      type: "ThreadMessage",
    });
  },
});

export default Review;
