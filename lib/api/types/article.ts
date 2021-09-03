import prisma from "@/lib/prisma";
import _ from "lodash";
import { objectType } from "nexus";

const Article = objectType({
  name: "Article",
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.anonymous();
    t.list.field("authors", {
      type: "User",
      resolve: async (root, _args, ctx) => {
        const authorships = await ctx.prisma.authorship.findMany({
          where: {
            articleId: root.id,
          },
          include: {
            user: true,
          },
        });
        const isAuthor = Boolean(
          _.findLast(authorships, (o) => o.userId === ctx.user.id)
        );
        if (root.anonymous && !isAuthor) {
          return null;
        }
        return _.sortBy(authorships, ["authorNumber"]).map(
          (authorship) => authorship.user
        );
      },
    });
    t.model.versions({ pagination: false });
    t.model.reviews({ filtering: { published: true } });
    t.list.field("acceptedVenues", {
      type: "Venue",
      resolve: async (parent) => {
        const acceptances = await prisma.decision.findMany({
          where: { articleId: parent.id, decision: true },
          include: {
            venue: true,
          },
        });
        return acceptances.map((decision) => decision.venue);
      },
    });
  },
});

export default Article;
