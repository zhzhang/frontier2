import prisma from "@/lib/prisma";
import _ from "lodash";
import { objectType } from "nexus";

const Article = objectType({
  name: "Article",
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.anonymous();
    t.model.versions({ pagination: false });
    t.model.reviews({ filtering: { published: true } });
    t.nullable.list.field("authors", {
      type: "Identity",
      resolve: async ({ id, anonymous }, _args, ctx) => {
        if (anonymous) {
          return null;
        }
        const authorships = await ctx.prisma.identity.findMany({
          where: {
            articleId: id,
            context: "AUTHOR",
          },
          include: {
            user: true,
          },
        });
        return _.sortBy(authorships, ["number"]);
      },
    });
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
