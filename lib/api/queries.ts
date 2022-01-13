import { nonNull, nullable, objectType, stringArg } from "nexus";
import { RoleEnum } from "../types";

export default objectType({
  name: "Query",
  definition(t) {
    t.nullable.field("draftMessage", {
      type: "ThreadMessage",
      args: {
        userId: stringArg(),
        articleId: stringArg(),
        headId: nullable(stringArg()),
      },
      resolve: async (_, { articleId, userId, headId }, ctx) => {
        const draftMessage = await ctx.prisma.threadMessage.findFirst({
          where: {
            articleId,
            author: {
              id: userId,
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
