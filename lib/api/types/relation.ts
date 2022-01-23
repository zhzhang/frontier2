import prisma from "@/lib/prisma";
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
    t.string("id");
    t.string("relation");
    t.nullable.field("endDate", { type: "DateTime" });
    t.field("target", {
      type: "User",
      resolve: async ({ targetId }, _args, _ctx) => {
        return await prisma.user.findUnique({
          where: {
            id: targetId,
          },
        });
      },
    });
  },
});

export default Relation;
