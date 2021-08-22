import { objectType } from "nexus";

const Authorship = objectType({
  name: "Authorship",
  definition(t) {
    t.model.id();
    t.model.user();
    t.model.authorNumber();
    t.model.article();
  },
});

export default Authorship;
