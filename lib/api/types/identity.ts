import { objectType } from "nexus";

const Identity = objectType({
  name: "Identity",
  definition(t) {
    t.model.id();
    t.model.context();
    t.model.number();
    t.model.venue();
    t.model.article();
    t.nullable.field("user", {
      type: "User",
      resolve: async ({ anonymized, userId }, _args, ctx) => {
        if (anonymized) {
          return null;
        }
        const user = await ctx.prisma.user.findUnique({
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
