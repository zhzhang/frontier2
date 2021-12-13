import { objectType } from "nexus";

const ThreadMessage = objectType({
  name: "ThreadMessage",
  definition(t) {
    t.model.id();
    t.model.type();
    t.model.body();
    t.model.highlights();
    t.model.author();
    t.model.article();
    t.model.rating();
    t.model.decision();
    t.model.publishTimestamp();
    t.model.released();
  },
});

export default ThreadMessage;
