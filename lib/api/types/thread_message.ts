import { objectType } from "nexus";

const ThreadMessage = objectType({
  name: "ThreadMessage",
  definition(t) {
    t.model.id();
    t.model.body();
    t.model.highlights();
    t.model.author();
    t.model.createdAt();
  },
});

export default ThreadMessage;
