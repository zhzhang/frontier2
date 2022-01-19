import prisma from "@/lib/prisma";
import { objectType } from "nexus";

const ReviewRequest = objectType({
  name: "ReviewRequest",
  definition(t) {
    t.string("id");
    t.string("type");
    t.string("status");
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
