import prisma from "@/lib/prisma";
import { objectType } from "nexus";

const Identity = objectType({
  name: "Identity",
  definition(t) {
    t.string("id");
    t.string("context");
    t.int("number");
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
    t.nullable.field("user", {
      type: "User",
      resolve: async ({ anonymized, userId }, _args, _ctx) => {
        if (anonymized) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        return user;
      },
    });
  },
});

export default Identity;
