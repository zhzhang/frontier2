import prisma from "@/lib/prisma";
import {
  inputObjectType,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus";
import { RoleEnum } from "../types";

export default objectType({
  name: "Query",
  definition(t) {
    t.field("user", {
      type: "User",
      args: {
        id: stringArg(),
      },
      resolve: async (_root, { id }, _ctx) => {
        return await prisma.user.findUnique({
          where: {
            id,
          },
        });
      },
    });
    t.field("article", {
      type: "Article",
      args: {
        id: stringArg(),
      },
      resolve: async (_root, { id }, _ctx) => {
        return await prisma.article.findUnique({
          where: {
            id,
          },
        });
      },
    });
    t.list.field("feedArticles", {
      type: "Article",
      resolve: async (_root, _args, _ctx) => {
        return await prisma.article.findMany();
      },
    });
    t.list.field("userArticles", {
      type: "Article",
      args: {
        userId: stringArg(),
      },
      resolve: async (_root, { userId }, _ctx) => {
        return await prisma.article.findMany();
      },
    });
    t.list.field("venues", {
      type: "Venue",
      resolve: async (_root, _args, _ctx) => {
        return await prisma.venue.findMany();
      },
    });

    const ThreadMessagesInputType = inputObjectType({
      name: "ThreadMessagesInput",
      definition(t) {
        t.nonNull.string("articleId");
        t.nullable.string("headId");
        t.nullable.string("after");
      },
    });
    t.list.field("threadMessages", {
      type: "ThreadMessage",
      args: {
        input: ThreadMessagesInputType,
      },
      resolve: async (_root, { input: { articleId, headId } }, _ctx) => {
        return await prisma.threadMessage.findMany({
          where: {
            articleId,
            headId: headId || null,
            published: true,
            released: true,
          },
          orderBy: [
            {
              publishTimestamp: "desc",
            },
          ],
        });
      },
    });
    t.nullable.field("draftMessage", {
      type: "ThreadMessage",
      args: {
        type: stringArg(),
        articleId: stringArg(),
        headId: nullable(stringArg()),
      },
      resolve: async (_, { articleId, headId }, { user }) => {
        const draftMessage = await prisma.threadMessage.findFirst({
          where: {
            articleId,
            author: {
              id: user.id,
            },
            headId,
            published: false,
          },
        });
        return draftMessage;
      },
    });
    t.list.field("submissionOwnerCandidates", {
      type: "User",
      args: { venueId: stringArg() },
      resolve: async (_, { venueId }, ctx) => {
        const results = await ctx.prisma.venueMembership.findMany({
          where: {
            venueId,
            role: "CHAIR",
          },
          include: {
            user: true,
          },
        });
        return results.map((role) => role.user);
      },
    });
    t.list.field("searchOpenVenues", {
      type: "Venue",
      args: { query: stringArg() },
      resolve: async (_, { query }, ctx) => {
        if (query.length < 2) {
          return [];
        }
        const now = new Date(Date.now());
        return await ctx.prisma.venue.findMany({
          where: {
            AND: [
              {
                OR: [
                  {
                    name: {
                      contains: query,
                    },
                  },
                  {
                    abbreviation: {
                      contains: query,
                    },
                  },
                ],
              },
              {
                OR: [
                  {
                    AND: [
                      { submissionDeadline: { gt: now } },
                      { acceptingSubmissions: true },
                    ],
                  },
                  {
                    AND: [
                      { submissionDeadline: null },
                      { acceptingSubmissions: true },
                    ],
                  },
                ],
              },
            ],
          },
        });
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
