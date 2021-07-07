import prisma from "@/lib/prisma";
import { objectType } from "nexus";

const Submission = objectType({
  name: "Submission",
  definition(t) {
    t.string("id");
    t.string("organizationId");
    t.string("articleId");
    t.field("article", {
      type: "Article",
      resolve: (parent) => {
        return parent.article;
      },
    });
    t.field("organization", { type: "Organization" });
    t.field("owner", {
      type: "User",
      resolve: async (parent) => {
        if (parent.ownerId) {
          return await prisma.user.findUnique({
            where: {
              id: parent.ownerId,
            },
          });
        }
        return null;
      },
    });
    t.list.field("requestedReviewers", {
      type: "User",
      resolve: (parent) => {
        return parent.requestedReviewers;
      },
    });
  },
});

export default Submission