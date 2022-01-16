import { isAdmin } from "@/lib/api/utils";
import prisma from "@/lib/prisma";
import {
  booleanArg,
  inputObjectType,
  list,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus";
import stream from "stream";
import { jsonArg } from "./types/json";
import { messageTypeToIdentityContext } from "./utils";

function uploadFromStream(bucket, key) {
  const pass = new stream.PassThrough();

  const params = {
    Key: key,
    Body: pass,
  };
  bucket.upload(params, function (err, data) {
    console.log(err, data);
  });

  return pass;
}

export default objectType({
  name: "Mutation",
  definition(t) {
    const VenueCreateInputType = inputObjectType({
      name: "VenueCreateInput",
      definition(t) {
        t.nonNull.string("name");
        t.nullable.string("abbreviation");
        t.nullable.field("venueDate", { type: "DateTime" });
      },
    });
    t.field("createVenue", {
      type: "Venue",
      args: {
        input: VenueCreateInputType,
      },
      resolve: async (
        _,
        { input: { name, abbreviation, venueDate } },
        { user }
      ) => {
        return await prisma.venue.create({
          data: {
            name,
            abbreviation: abbreviation || null,
            venueDate: venueDate || null,
            memberships: {
              create: [
                {
                  role: "ADMIN",
                  user: {
                    connect: {
                      id: user.id,
                    },
                  },
                },
              ],
            },
          },
        });
      },
    });

    const VenueUpdateInputType = inputObjectType({
      name: "VenueUpdateInput",
      definition(t) {
        t.nonNull.string("venueId");
        t.nullable.string("name");
        t.nullable.string("description");
        t.nullable.string("abbreviation");
        t.nullable.field("venueDate", { type: "DateTime" });
        t.nullable.field("submissionDeadline", { type: "DateTime" });
      },
    });
    t.field("updateVenue", {
      type: "Venue",
      args: {
        input: VenueUpdateInputType,
      },
      resolve: async (_, { input: { venueId, ...data } }, { user }) => {
        if (!isAdmin(venueId, user.id)) {
          throw Error("You are not authorized to update this venue.");
        }
        return await prisma.venue.update({
          data,
          where: {
            id: venueId,
          },
        });
      },
    });

    const VenueMembershipCreateInputType = inputObjectType({
      name: "VenueMembershipsCreateInput",
      definition(t) {
        t.nonNull.string("venueId");
        t.nonNull.string("role");
        t.nonNull.list.string("userIds");
      },
    });
    t.list.field("createVenueMemberships", {
      type: "VenueMembership",
      args: {
        input: VenueMembershipCreateInputType,
      },
      resolve: async (
        _root,
        { input: { venueId, role, userIds } },
        { user }
      ) => {
        if (!isAdmin(venueId, user.id)) {
          throw Error("You are not authorized to update this venue.");
        }
        let response = [];
        for (let userId of userIds) {
          const previous = await prisma.venueMembership.findFirst({
            where: {
              venueId,
              userId,
              role,
            },
          });
          if (!previous) {
            const resp = await prisma.venueMembership.create({
              data: {
                venueId,
                userId,
                role,
              },
            });
            response.push(resp);
          }
        }
        return response;
      },
    });

    t.nullable.field("deleteVenueMembership", {
      type: "VenueMembership",
      args: {
        id: stringArg(),
      },
      resolve: async (_, { id }, { user }) => {
        const membership = await prisma.venueMembership.findUnique({
          where: {
            id,
          },
        });
        if (!isAdmin(membership.venueId, user.id)) {
          return null;
        }
        return await prisma.venueMembership.delete({
          where: {
            id,
          },
        });
      },
    });

    const ThreadMessageCreateInputType = inputObjectType({
      name: "ThreadMessageCreateInput",
      definition(t) {
        t.nonNull.string("type");
        t.nonNull.string("articleId");
        t.nullable.string("headId");
      },
    });
    t.field("createThreadMessage", {
      type: "ThreadMessage",
      args: {
        input: nonNull(ThreadMessageCreateInputType),
      },
      resolve: async (_, { input: { articleId, headId, type } }, { user }) => {
        // TODO make sure headId null if not comment.
        return await prisma.threadMessage.create({
          data: {
            type,
            body: "",
            highlights: [],
            article: {
              connect: {
                id: articleId,
              },
            },
            headId,
            author: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      },
    });

    const AssignSubmissionInputType = inputObjectType({
      name: "AssignSubmissionInput",
      definition(t) {
        t.nonNull.string("submissionId");
        t.nonNull.string("ownerId");
      },
    });
    t.field("assignSubmissionOwner", {
      type: "Submission",
      args: {
        input: nonNull(AssignSubmissionInputType),
      },
      resolve: async (_, { input: { submissionId, ownerId } }, ctx) => {
        const submission = await ctx.prisma.submission.update({
          where: {
            id: submissionId,
          },
          data: {
            owner: {
              connect: {
                id: ownerId,
              },
            },
          },
        });
        return submission;
      },
    });

    t.field("publishMessage", {
      type: "ThreadMessage",
      args: {
        id: nonNull(stringArg()),
        body: nonNull(stringArg()),
        highlights: nonNull(jsonArg()),
      },
      resolve: async (_, { id, body, highlights }, ctx) => {
        const message = await ctx.prisma.threadMessage.findUnique({
          where: {
            id,
          },
        });
        const { authorId, articleId, type, venueId } = message;
        if (body.length === 0) {
          throw Error("Cannot publish an empty message.");
        }
        let identity = await ctx.prisma.identity.findFirst({
          where: {
            userId: authorId,
            articleId,
          },
        });
        if (!identity) {
          const context = messageTypeToIdentityContext(type);
          const articleIdentities = await ctx.prisma.identity.findMany({
            where: {
              AND: [
                {
                  articleId: { equals: articleId },
                },
                {
                  context: context && { equals: context },
                },
              ],
            },
          });
          identity = await ctx.prisma.identity.create({
            data: {
              userId: authorId,
              articleId,
              context,
              number: articleIdentities.length + 1,
              venueId,
              anonymized: false,
            },
          });
        }
        return await ctx.prisma.threadMessage.update({
          where: {
            id,
          },
          data: {
            published: true,
            body,
            highlights,
            publishTimestamp: new Date(Date.now()),
            authorIdentityId: identity.id,
            released: type === "COMMENT" ? true : undefined,
          },
          include: {
            authorIdentity: {
              include: {
                user: true,
                venue: true,
              },
            },
          },
        });
      },
    });
    t.field("createArticle", {
      type: "Article",
      args: {
        title: nonNull(stringArg()),
        abstract: nonNull(stringArg()),
        authorIds: nonNull(list(nonNull(stringArg()))),
        ref: nonNull(stringArg()),
        anonymous: nonNull(booleanArg()),
        venueId: nullable(stringArg()),
      },
      resolve: async (
        _,
        { title, abstract, authorIds, anonymous, ref, venueId },
        ctx
      ) => {
        if (!authorIds.includes(ctx.user.id)) {
          throw Error("The submitter of the article must be an author.");
        }
        let authorCreationArgs = [];
        for (const [index, authorId] of authorIds.entries()) {
          authorCreationArgs.push({
            context: "AUTHOR",
            userId: authorId,
            number: index + 1,
          });
        }
        const input = {
          data: {
            title,
            abstract,
            authors: {
              create: authorCreationArgs,
            },
            anonymous,
            versions: {
              create: [
                {
                  ref: ref,
                  versionNumber: 1,
                },
              ],
            },
          },
        };
        const article = await ctx.prisma.article.create(input);
        if (venueId) {
          const sub = await ctx.prisma.submission.create({
            data: {
              articleId: article.id,
              venueId,
            },
          });
        }
        return article;
      },
    });
  },
});
