import { objectType } from "nexus";

const Submission = objectType({
  name: "Submission",
  definition(t) {
    t.model.id();
    t.model.article();
    t.model.owner();
    t.model.venue();
    t.model.reviewRequests();
    t.model.createdAt();
  },
});

export default Submission;
