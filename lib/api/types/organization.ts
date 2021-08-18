import { isOrganizationAdmin } from "@/lib/api/utils";
import prisma from "@/lib/prisma";
import { RoleEnum } from "@/lib/types";
import { objectType } from "nexus";
import Role from "./role";

const Organization = objectType({
  name: "Organization",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.abbreviation();
    t.model.logoRef();
    t.model.venues();
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

export default Organization;
