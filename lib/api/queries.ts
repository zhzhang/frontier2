import _ from "lodash";
import { list, nonNull, objectType, stringArg } from "nexus";
import prisma from "../prisma";
import { RoleEnum } from "../types";

export default objectType({
  name: "Query",
  definition(t) {
    t.field("user", {
      type: "User",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_, { id }, ctx) => {
        return ctx.prisma.user.findUnique({
          where: { id },
          include: {
            authorships: {
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
            },
          },
        });
      },
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
    t.field("article", {
      type: "Article",
      args: { id: nonNull(stringArg()) },
      resolve: async (_, { id }, ctx) => {
        return await ctx.prisma.article.findUnique({
          where: {
            id,
          },
          include: {
            authors: {
              include: {
                user: true,
              },
            },
          },
        });
      },
    });
    t.list.field("articles", {
      type: "Article",
      args: {},
      resolve: async (_, args, ctx) => {
        return await ctx.prisma.article.findMany({
          include: {
            versions: true,
            authors: {
              include: {
                user: true,
              },
            },
          },
        });
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
        return await ctx.prisma.review.findMany({
          where: {
            articleId,
          },
          include: {
            author: true,
            organization: true,
            threadMessages: {
              include: {
                author: true,
              },
            },
          },
        });
      },
    });
    t.field("organization", {
      type: "Organization",
      args: { id: nonNull(stringArg()) },
      resolve: (_, args, ctx) => {
        return ctx.prisma.organization.findUnique({
          where: { id: args.id },
        });
      },
    });
    t.list.field("browseOrganizations", {
      type: "Organization",
      args: { tags: list(stringArg()) },
      resolve: (_, _args, ctx) => {
        return ctx.prisma.organization.findMany();
      },
    });
    t.list.field("searchUsers", {
      type: "User",
      args: { query: stringArg() },
      resolve: async (_, { query }, ctx) => {
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
