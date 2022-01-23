import prisma from "@/lib/prisma";
import { objectType } from "nexus";

const ReviewRequest = objectType({
  name: "ReviewRequest",
  definition(t) {
    t.string("id");
    t.string("type");
    t.string("status");
    t.field("article", {
      type: "Article",
      resolve: async ({ articleId }, _args, _ctx) => {
        return await prisma.article.findUnique({
          where: {
            id: articleId,
          },
        });
      },
    });
    t.field("venue", {
      type: "Venue",
      resolve: async ({ submissionId }, _args, _ctx) => {
        const submission = await prisma.submission.findUnique({
          where: {
            id: submissionId,
          },
          include: {
            venue: true,
          },
        });
        return submission.venue;
      },
    });
    t.nullable.field("user", {
      type: "User",
      resolve: async ({ userId }, _args, _ctx) => {
        return await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
      },
    });
  },
});

export default ReviewRequest;
