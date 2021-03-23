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
import { RoleEnum } from "../../lib/types";

export const Role = enumType({
  name: "Role",
  members: {
    ADMIN: "ADMIN",
    ACTION_EDITOR: "ACTION_EDITOR",
    NONE: "NONE",
  },
});

export const User = objectType({
  name: "User",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("email");
    t.list.field("articles", {
      type: "Article",
      resolve: (parent) => {
        return parent.articles;
      },
    });
  },
});

export const Article = objectType({
  name: "Article",
  definition(t) {
    t.string("id");
    t.string("title");
    t.boolean("anonymous");
    t.list.field("authors", {
      type: "User",
      resolve: (parent) => {
        if (parent.anonymous) {
          return null;
        }
        return _.sortBy(parent.authors, ["authorNumber"]).map(
          (authorship) => authorship.user
        );
      },
    });
    t.list.field("versions", {
      type: "ArticleVersion",
      resolve: (parent) => {
        return _.orderBy(parent.versions, ["versionNumber"], ["desc"]);
      },
    });
    t.list.field("reviews", {
      type: "Review",
      resolve: (parent, _tmp, ctx) => {
        return _.filter(
          parent.reviews,
          (review) => review.published || review.authorId === ctx.user.id
        );
      },
    });
    t.list.field("acceptedOrganizations", {
      type: "Organization",
      resolve: async (parent) => {
        const acceptances = await prisma.decision.findMany({
          where: { articleId: parent.id, decision: true },
          include: {
            organization: true,
          },
        });
        return acceptances.map((decision) => decision.organization);
      },
    });
  },
});

export const ArticleVersion = objectType({
  name: "ArticleVersion",
  definition(t) {
    t.string("id");
    t.string("ref");
    t.string("abstract");
    t.string("createdAt");
    t.int("versionNumber");
  },
});

export const Venue = objectType({
  name: "Venue",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("abbreviation");
    t.field("date", { type: "Date" });
  },
});

export const Organization = objectType({
  name: "Organization",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("description");
    t.string("abbreviation");
    t.string("logoRef");
    t.field("role", {
      type: Role,
      resolve: async (parent, _, ctx) => {
        if (!ctx.user) {
          return RoleEnum.NONE;
        }
        const membership = await prisma.organizationMembership.findFirst({
          where: {
            organizationId: parent.id,
            userId: ctx.user.id,
          },
        });
        if (membership) {
          return membership.role;
        }
        return RoleEnum.NONE;
      },
    });
    t.list.field("venues", {
      type: "Venue",
      resolve: async (parent) => {
        return await prisma.venue.findMany({
          where: {
            organizationId: parent.id,
          },
        });
      },
    });
    t.list.field("admins", {
      type: "User",
      resolve: async (parent) => {
        const memberships = await prisma.organizationMembership.findMany({
          where: {
            organizationId: parent.id,
            role: RoleEnum.ADMIN,
          },
          include: {
            user: true,
          },
        });
        return memberships.map((membership) => membership.user);
      },
    });
    t.list.field("editors", {
      type: "User",
      resolve: async (parent) => {
        const memberships = await prisma.organizationMembership.findMany({
          where: {
            organizationId: parent.id,
            role: RoleEnum.ACTION_EDITOR,
          },
          include: {
            user: true,
          },
        });
        return memberships.map((membership) => membership.user);
      },
    });
    t.list.field("accepted", {
      type: "Decision",
      resolve: async (parent) => {
        return await prisma.decision.findMany({
          where: {
            organizationId: parent.id,
            decision: true,
          },
          include: {
            author: true,
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
            citedReviews: {
              include: {
                author: true,
                organization: true,
              },
            },
          },
        });
      },
    });
  },
});

export const Review = objectType({
  name: "Review",
  definition(t) {
    t.string("id");
    t.string("body");
    t.int("rating");
    t.int("reviewNumber");
    t.boolean("published");
    t.boolean("canAccess");
    t.field("author", { type: "User" });
    t.field("submission", { type: "Submission" });
    t.field("organization", { type: "Organization" });
    t.list.field("threadMessages", {
      type: "ThreadMessage",
    });
  },
});

export const ThreadMessage = objectType({
  name: "ThreadMessage",
  definition(t) {
    t.string("id");
    t.string("body");
    t.field("author", { type: "User" });
    t.string("createdAt");
  },
});

export const Decision = objectType({
  name: "Decision",
  definition(t) {
    t.string("id");
    t.string("body");
    t.boolean("decision");
    t.field("author", { type: "User" });
    t.field("article", { type: "Article" });
    t.list.field("citedReviews", { type: "Review" });
  },
});

export const Submission = objectType({
  name: "Submission",
  definition(t) {
    t.string("id");
    t.string("organizationId");
    t.string("articleId");
    t.field("article", {
      type: "Article",
      resolve: (parent) => {
        return parent.article;
      },
    });
    t.field("organization", { type: "Organization" });
    t.field("chair", {
      type: "User",
      resolve: (parent) => {
        return parent.chair;
      },
    });
    t.list.field("requestedReviewers", {
      type: "User",
      resolve: (parent) => {
        return parent.requestedReviewers;
      },
    });
  },
});
