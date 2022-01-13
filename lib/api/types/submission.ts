import prisma from "@/lib/prisma";
import { objectType } from "nexus";

export default objectType({
  name: "Submission",
  definition(t) {
    t.string("id");
    t.field("createdAt", {
      type: "DateTime",
    });
    t.nullable.field("article", {
      type: "Article",
      resolve: async ({ articleId }, _args, _) => {
        return (
          articleId &&
          (await prisma.article.findUnique({
            where: {
              id: articleId,
            },
          }))
        );
      },
    });
    t.nullable.field("owner", {
      type: "User",
      resolve: async ({ ownerId }, _args, _) => {
        return (
          ownerId &&
          (await prisma.user.findUnique({
            where: {
              id: ownerId,
            },
          }))
        );
      },
    });
    t.nullable.field("venue", {
      type: "Venue",
      resolve: async ({ venueId }, _args, _) => {
        return (
          venueId &&
          (await prisma.venue.findUnique({
            where: {
              id: venueId,
            },
          }))
        );
      },
    });
    t.list.field("reviewRequests", {
      type: "ReviewRequest",
      resolve: async ({ id }, _args, _) => {
        return await prisma.reviewRequest.findMany({
          where: {
            submissionId: id,
          },
        });
      },
    });
  },
});
