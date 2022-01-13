import prisma from "@/lib/prisma";
import { objectType } from "nexus";

const ThreadMessage = objectType({
  name: "ThreadMessage",
  definition(t) {
    t.string("id");
    t.string("type");
    t.string("body");
    t.json("highlights");
    t.string("id");
    t.nullable.field("authorIdentity", {
      type: "Identity",
      resolve: async ({ authorIdentityId }, _args, _ctx) => {
        return (
          (await authorIdentityId) &&
          prisma.identity.findUnique({
            where: {
              id: authorIdentityId,
            },
          })
        );
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
        return await prisma.venue.findUnique({
          where: {
            id: venueId,
          },
        });
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
