import prisma from "@/lib/prisma";
import { ReviewRequestTypeEnum } from "@/lib/types";
import { objectType } from "nexus";

const ReviewRequest = objectType({
  name: "ReviewRequest",
  definition(t) {
    t.string("id");
    t.string("type");
    t.field("createdAt", { type: "DateTime" });
    t.string("status");
    t.string("note");
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
      resolve: async ({ venueId }, _args, _ctx) => {
        return await prisma.venue.findUnique({
          where: {
            id: venueId,
          },
        });
      },
    });
    t.nullable.field("chairRequest", {
      type: "ReviewRequest",
      resolve: async ({ id }, _args, _ctx) => {
        return await prisma.reviewRequest.findFirst({
          where: {
            type: ReviewRequestTypeEnum.CHAIR,
            parentRequestId: id,
          },
        });
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
