import { objectType } from "nexus";

const ArticleVersion = objectType({
  name: "ArticleVersion",
  definition(t) {
    t.model.id();
    t.model.ref();
    t.model.abstract();
    t.model.createdAt();
    t.model.versionNumber();
  },
});

export default ArticleVersion;
