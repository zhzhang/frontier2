import { objectType } from "nexus";

const Review = objectType({
  name: "Review",
  definition(t) {
    t.model.id();
    t.model.body();
    t.model.highlights();
    t.model.rating();
    t.model.publishTimestamp();
    t.model.published();
    t.model.anonymized();
    t.field("author", {
      type: "User",
      resolve: async (root, _args, ctx) => {
        if (root.anonymized) {
          return {
            id: "anonymous",
            name: "Anonymous Reviewer",
          };
        }
        const author = await ctx.prisma.user.findUnique({
          where: {
            id: root.authorId,
          },
        });
        return author;
      },
    });
  },
});

export default Review;
