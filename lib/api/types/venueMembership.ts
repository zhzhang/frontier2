import prisma from "@/lib/prisma";
import { objectType } from "nexus";

const VenueMembership = objectType({
  name: "VenueMembership",
  definition(t) {
    t.string("id");
    t.string("role");
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
export default VenueMembership;
