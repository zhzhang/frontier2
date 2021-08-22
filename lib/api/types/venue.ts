import { objectType } from "nexus";

const Venue = objectType({
  name: "Venue",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.abbreviation();
    t.model.websiteUrl();
    t.model.description();
    t.model.logoRef();
    t.model.submissionDeadline();
    t.model.submissionOpen();
    t.model.venueDate();
    t.field("role", {
      type: "Role",
      resolve: async (root, _, ctx) => {
        const userId = ctx.user.id;
        const membership = ctx.prisma.venueMembership.findFirst({
          where: {
            userId,
            venueId: root.id,
          },
        });
        return membership.role;
      },
    });
  },
});
export default Venue;
