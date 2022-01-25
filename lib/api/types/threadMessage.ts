import prisma from "@/lib/prisma";
import { userFromIdentity } from "@/lib/utils";
import { enumType, objectType } from "nexus";

export const ThreadMessageType = enumType({
  name: "TheadMessageType",
  members: {
    COMMENT: "COMMENT",
    REVIEW: "REVIEW",
    DECISION: "DECISION",
  },
});

const ThreadMessage = objectType({
  name: "ThreadMessage",
  definition(t) {
    t.string("id");
    t.field("type", { type: ThreadMessageType });
    t.string("body");
    t.json("highlights");
    t.string("id");
    t.nullable.field("author", {
      type: "User",
      resolve: async ({ authorIdentityId }, _args, _ctx) => {
        if (!authorIdentityId) {
          return authorIdentityId;
        }
        const authorIdentity = await prisma.identity.findUnique({
          where: {
            id: authorIdentityId,
          },
          include: {
            user: true,
          },
        });
        return userFromIdentity(authorIdentity);
      },
    });
    t.nullable.field("article", {
      type: "Article",
      resolve: async ({ articleId }, _args, _ctx) => {
        return await prisma.article.findUnique({
          where: {
            id: articleId,
          },
        });
      },
    });
    t.nullable.field("venue", {
      type: "Venue",
      resolve: async ({ venueId }, _args, _ctx) => {
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
    t.boolean("decision");
    t.field("publishTimestamp", {
      type: "DateTime",
    });
    t.boolean("published");
    t.boolean("released");
    t.int("rating");
    t.string("headId");
  },
});

export default ThreadMessage;
