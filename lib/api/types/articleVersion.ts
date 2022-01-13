import { objectType } from "nexus";

export default objectType({
  name: "ArticleVersion",
  definition(t) {
    t.string("id");
    t.string("ref");
    t.int("versionNumber");
    t.field("createdAt", {
      type: "DateTime",
    });
  },
});
