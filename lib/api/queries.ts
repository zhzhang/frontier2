import { isAdmin } from "@/lib/api/utils";
import prisma from "@/lib/prisma";
import { RoleEnum } from "@/lib/types";
import { ForbiddenError } from "apollo-server-micro";
import {
  inputObjectType,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus";

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
    t.list.field("userRelations", {
      type: "Relation",
      args: {
        userId: stringArg(),
      },
      resolve: async (_root, { userId }, { user }) => {
        if (user?.id !== userId) {
          return new ForbiddenError("Cannot access this user's relations.");
        }
        return await prisma.relation.findMany({
          where: {
            userId,
          },
        });
      },
    });
    t.list.field("userRequests", {
      type: "ReviewRequest",
      args: {
        userId: stringArg(),
      },
      resolve: async (_root, { userId }, { user }) => {
        if (user?.id !== userId) {
          return new ForbiddenError("Cannot access this user's relations.");
        }
        return await prisma.reviewRequest.findMany({
          where: {
            userId,
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

    const UserArticlesInputType = inputObjectType({
      name: "UserArticlesInput",
      definition(t) {
        t.nonNull.string("userId");
        t.nullable.int("limit");
        t.nullable.string("after");
      },
    });
    t.list.field("userArticles", {
      type: "Article",
      args: {
        input: UserArticlesInputType,
      },
      resolve: async (_root, { input: { userId } }, _ctx) => {
        const authorships = await prisma.identity.findMany({
          where: {
            userId,
            context: "AUTHOR",
          },
          include: {
            article: true,
          },
        });
        return authorships.map(({ article }) => article);
      },
    });

    const UserReviewsInputType = inputObjectType({
      name: "UserReviewsInput",
      definition(t) {
        t.nonNull.string("userId");
        t.nullable.int("limit");
        t.nullable.string("after");
      },
    });
    t.list.field("userReviews", {
      type: "ThreadMessage",
      args: {
        input: UserReviewsInputType,
      },
      resolve: async (_root, { input: { userId } }, _ctx) => {
        return await prisma.threadMessage.findMany({
          where: {
            authorId: userId,
            type: "REVIEW",
          },
          include: {
            article: true,
          },
        });
      },
    });

    t.field("venue", {
      type: "Venue",
      args: {
        id: stringArg(),
      },
      resolve: async (_root, { id }, _ctx) => {
        return await prisma.venue.findUnique({ where: { id } });
      },
    });
    t.list.field("venues", {
      type: "Venue",
      resolve: async (_root, _args, _ctx) => {
        return await prisma.venue.findMany();
      },
    });

    const VenueArticlesInputType = inputObjectType({
      name: "VenueArticlesInput",
      definition(t) {
        t.nonNull.string("venueId");
        t.nullable.string("headId");
        t.nullable.string("after");
      },
    });
    t.list.field("venueArticles", {
      type: "Article",
      args: {
        input: VenueArticlesInputType,
      },
      resolve: async (_root, { input: { venueId, headId } }, _ctx) => {
        const decisions = await prisma.threadMessage.findMany({
          where: {
            type: "DECISION",
            venueId,
            published: true,
            released: true,
          },
          orderBy: [
            {
              publishTimestamp: "desc",
            },
          ],
          include: {
            article: true,
          },
        });
        return decisions.map(({ article }) => article);
      },
    });

    const VenueReviewRequestsInputType = inputObjectType({
      name: "VenueReviewRequestsInput",
      definition(t) {
        t.nonNull.string("venueId");
        t.nullable.string("headId");
        t.nullable.string("after");
      },
    });
    t.list.field("venueReviewRequests", {
      type: "ReviewRequest",
      args: {
        input: VenueReviewRequestsInputType,
      },
      resolve: async (_root, { input: { venueId, headId } }, { user }) => {
        if (!(await isAdmin(venueId, user.id))) {
          return [];
        }
        return await prisma.reviewRequest.findMany({
          where: {
            type: "ROOT",
            venueId,
          },
        });
      },
    });

    const VenueMembershipsInputType = inputObjectType({
      name: "VenueMembershipsInput",
      definition(t) {
        t.nonNull.string("venueId");
        t.nonNull.string("role");
        t.nullable.string("headId");
        t.nullable.string("after");
      },
    });
    t.list.field("venueMemberships", {
      type: "VenueMembership",
      args: {
        input: VenueMembershipsInputType,
      },
      resolve: async (_root, { input: { venueId, role } }, { user }) => {
        if (!(await isAdmin(venueId, user.id))) {
          return [];
        }
        return await prisma.venueMembership.findMany({
          where: {
            venueId,
            role,
          },
        });
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
  },
});
