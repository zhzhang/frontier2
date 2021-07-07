import { objectType } from "nexus";

const ThreadMessage = objectType({
  name: "ThreadMessage",
  definition(t) {
    t.string("id");
    t.string("body");
    t.string("highlights");
    t.int("articleVersion");
    t.field("author", { type: "User" });
    t.string("createdAt");
  },
});

export default ThreadMessage;
