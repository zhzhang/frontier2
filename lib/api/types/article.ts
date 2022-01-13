import prisma from "@/lib/prisma";
import _ from "lodash";
import { objectType } from "nexus";

const Article = objectType({
  name: "Article",
  definition(t) {
    t.string("id");
    t.string("title");
    t.string("abstract");
    t.boolean("anonymous");
    t.nonNull.list.field("versions", {
      type: "ArticleVersion",
      resolve: async ({ id }, _args, ctx) => {
        return await prisma.articleVersion.findMany({
          where: {
            articleId: id,
          },
        });
      },
    });
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
        const acceptances = await prisma.threadMessage.findMany({
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
