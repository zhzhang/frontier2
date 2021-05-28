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
import { isOrganizationAdmin } from "./utils";

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
    t.model.id();
    t.model.name();
    t.model.email();
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
    t.model.id();
    t.model.title();
    t.model.anonymous();
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
    // t.model.versions({ pagination: false });
    t.list.field("versions", {
      type: "ArticleVersion",
      resolve: async (parent) => {
        return _.orderBy(
          await prisma.articleVersion.findMany({
            where: {
              articleId: parent.id,
            },
          }),
          ["versionNumber"],
          ["desc"]
        );
      },
    });
    t.model.reviews({ filtering: { published: true } });
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
    t.model.id();
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
    t.list.field("submissions", {
      type: "Submission",
      resolve: async (parent, _, ctx) => {
        if (ctx.user) {
          if (await isOrganizationAdmin(ctx.user.id, parent.id)) {
            return await prisma.submission.findMany({
              where: {
                organizationId: parent.id,
                decisionId: null,
              },
              include: {
                article: true,
              },
            });
          }
        }
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
    t.string("highlights");
    t.int("rating");
    t.int("reviewNumber");
    t.int("articleVersion");
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
    t.string("highlights");
    t.int("articleVersion");
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
    t.field("owner", {
      type: "User",
      resolve: async (parent) => {
        if (parent.ownerId) {
          return await prisma.user.findUnique({
            where: {
              id: parent.ownerId,
            },
          });
        }
        return null;
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
