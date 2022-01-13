import { objectType } from "nexus";

export default objectType({
  name: "Venue",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("abbreviation");
    t.string("description");
    t.nullable.string("websiteUrl");
    t.nullable.string("logoRef");
    t.boolean("acceptingSubmissions");
    t.nullable.field("submissionDeadline", {
      type: "DateTime",
    });
    t.nullable.field("venueDate", {
      type: "DateTime",
    });
    t.field("role", {
      type: "Role",
      resolve: async (root, _, ctx) => {
        const userId = ctx.user.id;
        const membership = await ctx.prisma.venueMembership.findFirst({
          where: {
            userId,
            venueId: root.id,
          },
        });
        return membership && membership.role;
      },
    });
  },
});
