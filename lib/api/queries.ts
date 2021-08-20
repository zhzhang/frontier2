import _ from "lodash";
import { nonNull, objectType, stringArg } from "nexus";
import prisma from "../prisma";
import { RoleEnum } from "../types";

export default objectType({
  name: "Query",
  definition(t) {
    t.crud.user();
    t.crud.article();
    t.crud.articles({ filtering: true });
    t.crud.venue();
    t.crud.venues({
      filtering: true,
    });
    t.list.field("userArticles", {
      type: "Article",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_parent, { id }, ctx) => {
        const articles = (
          await ctx.prisma.articleAuthor.findMany({
            where: { userId: id },
            include: {
              article: {
                include: {
                  authors: {
                    include: {
                      user: true,
                    },
                  },
                  versions: true,
                },
              },
            },
          })
        ).map((authorship) => authorship.article);
        if (!(ctx.user?.id === id)) {
          return _.filter(articles, (a) => !a.anonymous); // Filter out anonymous articles if the viewer is not the author.
        }
        return articles;
      },
    });
    t.list.field("articleVersions", {
      type: "ArticleVersion",
      args: {},
      resolve: async (_parent, { articleId }, ctx) => {
        return _.orderBy(
          await prisma.articleVersion.findMany({
            where: {
              articleId,
            },
          }),
          ["versionNumber"],
          ["desc"]
        );
      },
    });
    t.list.field("reviews", {
      type: "Review",
      args: { articleId: nonNull(stringArg()) },
      resolve: async (_, { articleId }, ctx) => {
        const reviews = await ctx.prisma.review.findMany({
          where: {
            articleId,
          },
          include: {
            author: true,
          },
        });
        return reviews.map((review) => {
          return {
            ...review,
            author: review.anonymized
              ? review.author
              : {
                  id: "anonymous",
                  name: `Reviewer ${review.reviewNumber}`,
                },
          };
        });
      },
    });
    t.field("review", {
      type: "Review",
      args: { reviewId: nonNull(stringArg()) },
      resolve: async (_, { reviewId }, ctx) => {
        return await ctx.prisma.review.findUnique({
          where: {
            id: reviewId,
          },
          include: {
            author: true,
          },
        });
      },
    });
    t.list.field("decisions", {
      type: "Decision",
      args: { articleId: nonNull(stringArg()) },
      resolve: async (_, { articleId }, ctx) => {
        const tmp = await ctx.prisma.decision.findMany({
          where: {
            articleId,
          },
          include: {
            author: true,
            citedReviews: {
              include: {
                author: true,
              },
            },
          },
        });
        return tmp;
      },
    });
    t.list.field("threadMessages", {
      type: "ThreadMessage",
      args: { headId: nonNull(stringArg()), cursor: stringArg() },
      resolve: async (_, { headId, cursor }, ctx) => {
        let query = {
          take: 1,
          where: {
            headId,
          },
          orderBy: {
            createdAt: "asc",
          },
          include: {
            author: true,
          },
        };
        if (cursor) {
          query = {
            ...query,
            skip: 1,
            cursor: {
              id: cursor,
            },
          };
        }
        return await ctx.prisma.threadMessage.findMany(query);
      },
    });
    t.list.field("searchUsers", {
      type: "User",
      args: { query: stringArg() },
      resolve: async (_, { query }, ctx) => {
        if (query.length < 2) {
          return [];
        }
        return await ctx.prisma.user.findMany({
          where: {
            name: {
              contains: query,
            },
          },
        });
      },
    });
    t.list.field("searchEditors", {
      type: "User",
      args: { query: stringArg(), organizationId: nonNull(stringArg()) },
      resolve: async (_, { query, organizationId }, ctx) => {
        const memberships = await ctx.prisma.organizationMembership.findMany({
          where: {
            organizationId,
            role: RoleEnum.ACTION_EDITOR,
          },
          include: {
            user: true,
          },
        });
        return memberships.map((membership) => membership.user);
      },
    });
    t.list.field("reviewerAssignedSubmissions", {
      type: "Submission",
      resolve: async (_, _args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
          include: {
            reviewRequests: {
              include: {
                article: true,
              },
            },
          },
        });
        return user.reviewRequests;
      },
    });
  },
});
