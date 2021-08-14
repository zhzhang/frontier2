import { objectType } from "nexus";

const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();
    t.model.bio();
    t.model.profilePictureUrl();
    t.list.field("articles", {
      type: "Article",
      resolve: (parent) => {
        return parent.articles;
      },
    });
    t.list.field("relations", {
      type: "Relation",
      resolve: async (parent, _, ctx) => {
        if (ctx.user.id !== parent.id) {
          return [];
        }
        return await ctx.prisma.relation.findMany({
          where: {
            userId: parent.id,
          },
        });
      },
    });
  },
});

export default User;
