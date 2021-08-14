import { enumType, objectType } from "nexus";

export const RelationType = enumType({
  name: "RelationType",
  members: {
    ADVISOR: "ADVISOR",
    ADVISEE: "ADVISEE",
    COAUTHOR: "COAUTHOR",
    COWORKER: "COWORKER",
    FAMILY: "FAMILY",
    SOCIAL: "SOCIAL",
  },
});

const Relation = objectType({
  name: "Relation",
  definition(t) {
    t.model.id();
    t.model.target();
    t.model.endYear();
    t.model.relation();
  },
});

export default Relation;
