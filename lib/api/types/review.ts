import { objectType } from "nexus";

const Review = objectType({
  name: "Review",
  definition(t) {
    t.model.id();
    t.model.body();
    t.model.highlights();
    t.model.rating();
    t.model.reviewNumber();
    t.model.published();
    t.model.author();
    t.model.venue();
  },
});

export default Review;
