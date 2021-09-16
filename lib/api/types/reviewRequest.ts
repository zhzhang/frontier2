import { objectType } from "nexus";

const ReviewRequest = objectType({
  name: "ReviewRequest",
  definition(t) {
    t.model.id();
    t.model.user();
    t.model.article();
    t.model.submission();
    t.model.status();
  },
});

export default ReviewRequest;
