import {
  asNexusMethod,
  makeSchema,
  nonNull,
  list,
  nullable,
  enumType,
  objectType,
  stringArg,
  intArg,
  booleanArg,
} from "nexus";
import prisma from "../prisma";
import _ from "lodash";
import { RoleEnum } from "../types";

export default objectType({
  name: "Query",
  definition(t) {
    t.field("user", {
      type: "User",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_, { id }) => {
        return prisma.user.findUnique({
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
      resolve: async (_, { id }) => {
        return (
          await prisma.articleAuthor.findMany({
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
      },
    });
    t.field("article", {
      type: "Article",
      args: { id: nonNull(stringArg()) },
      resolve: async (_, { id }, ctx) => {
        return await prisma.article.findUnique({
          where: {
            id,
          },
          include: {
            versions: true,
            authors: {
              include: {
                user: true,
              },
            },
            reviews: {
              include: {
                organization: true,
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
        return await prisma.article.findMany({
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
    t.list.field("reviews", {
      type: "Review",
      args: { articleId: nonNull(stringArg()) },
      resolve: async (_, { articleId }, ctx) => {
        return await prisma.review.findMany({
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
      resolve: (_, args) => {
        return prisma.organization.findUnique({
          where: { id: args.id },
        });
      },
    });
    t.list.field("browseOrganizations", {
      type: "Organization",
      args: { tags: list(stringArg()) },
      resolve: (_, _args) => {
        return prisma.organization.findMany();
      },
    });
    t.list.field("searchUsers", {
      type: "User",
      args: { query: stringArg() },
      resolve: async (_, { query }) => {
        return await prisma.user.findMany({
          where: {
            name: {
              contains: query,
            },
          },
        });
      },
    });
    t.list.field("reviewerAssignedSubmissions", {
      type: "Submission",
      resolve: async (_, _args, ctx) => {
        const user = await prisma.user.findUnique({
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