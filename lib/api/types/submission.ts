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
      resolve: async ({ id }, _args, _) => {
        const reviewRequest = await prisma.reviewRequest.findFirst({
          where: {
            submissionId: id,
            type: "CHAIR",
          },
          include: {
            user: true,
          },
        });
        return reviewRequest && reviewRequest.user;
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
