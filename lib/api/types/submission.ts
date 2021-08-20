import { objectType } from "nexus";

const Submission = objectType({
  name: "Submission",
  definition(t) {
    t.model.id();
    t.model.article();
    t.model.owner();
    t.list.field("requestedReviewers", {
      type: "User",
      resolve: (parent) => {
        return parent.requestedReviewers;
      },
    });
  },
});

export default Submission;
