import { isAdmin } from "@/lib/api/utils";
import prisma from "@/lib/prisma";
import {
  ReviewRequestStatusEnum,
  ReviewRequestTypeEnum,
  RoleEnum,
} from "@/lib/types";
import { ForbiddenError } from "apollo-server-micro";
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
    const UserUpdateInputType = inputObjectType({
      name: "UserUpdateInput",
      definition(t) {
        t.nonNull.string("id");
        t.nullable.string("name");
        t.nullable.string("website");
        t.nullable.string("twitter");
        t.nullable.string("institution");
        t.nullable.string("profilePictureRef");
      },
    });
    t.field("updateUser", {
      type: "User",
      args: {
        input: UserUpdateInputType,
      },
      resolve: async (_, { input: { id, ...data } }, { user }) => {
        if (id !== user.id) {
          return new ForbiddenError(
            "You are not authorized to modify this user."
          );
        }
        return await prisma.user.update({
          data,
          where: {
            id,
          },
        });
      },
    });

    const AddRelationInputType = inputObjectType({
      name: "AddRelationInput",
      definition(t) {
        t.nonNull.string("userId");
        t.nonNull.string("targetId");
        t.nonNull.string("relation");
        t.nullable.field("endDate", { type: "DateTime" });
      },
    });
    t.field("addRelation", {
      type: "Relation",
      args: {
        input: AddRelationInputType,
      },
      resolve: async (
        _,
        { input: { userId, targetId, ...data } },
        { user }
      ) => {
        if (userId !== user.id) {
          return new ForbiddenError(
            "You are not authorized to modify this user."
          );
        }
        return await prisma.relation.create({
          data: {
            id: userId + targetId,
            targetId,
            userId,
            ...data,
          },
        });
      },
    });
    t.field("deleteRelation", {
      type: "Relation",
      args: {
        id: stringArg(),
      },
      resolve: async (_, { id }, { user }) => {
        const relation = await prisma.relation.findUnique({
          where: {
            id,
          },
        });
        if (relation.userId !== user.id) {
          return new ForbiddenError(
            "You are not authorized to modify this user."
          );
        }
        await prisma.relation.delete({
          where: {
            id,
          },
        });
        return relation;
      },
    });

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
                  role: RoleEnum.ADMIN,
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
        t.nullable.string("reviewTemplate");
        t.nullable.boolean("acceptingSubmissions");
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
          return new ForbiddenError(
            "You are not authorized to update this venue."
          );
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
          return new ForbiddenError(
            "You are not authorized to update this venue."
          );
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
        t.nonNull.field("type", { type: "TheadMessageType" });
        t.nonNull.string("articleId");
        t.nullable.string("reviewRequestId");
        t.nullable.string("headId");
        t.nullable.string("venueId");
      },
    });
    t.field("createThreadMessage", {
      type: "ThreadMessage",
      args: {
        input: nonNull(ThreadMessageCreateInputType),
      },
      resolve: async (
        _,
        { input: { articleId, headId, venueId, type } },
        { user }
      ) => {
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
            venue: venueId ? { connect: { id: venueId } } : undefined,
          },
        });
      },
    });

    const ThreadMessageUpdateInputType = inputObjectType({
      name: "ThreadMessageUpdateInput",
      definition(t) {
        t.nonNull.string("id");
        t.nullable.string("body");
        t.nullable.json("highlights");
        t.nullable.boolean("decision");
      },
    });
    t.field("updateThreadMessage", {
      type: "ThreadMessage",
      args: {
        input: nonNull(ThreadMessageUpdateInputType),
      },
      resolve: async (
        _,
        { input: { id, body, highlights, decision } },
        { user }
      ) => {
        const message = await prisma.threadMessage.findUnique({
          where: {
            id,
          },
        });
        if (message.authorId !== user?.id) {
          return new ForbiddenError("Not authorized to modify this post.");
        }
        return await prisma.threadMessage.update({
          where: {
            id,
          },
          data: {
            body,
            highlights,
            decision,
          },
        });
      },
    });

    t.field("deleteThreadMessage", {
      type: "ThreadMessage",
      args: {
        id: stringArg(),
      },
      resolve: async (_, { id }, { user }) => {
        const message = await prisma.threadMessage.findUnique({
          where: {
            id,
          },
        });
        if (message.authorId !== user?.id) {
          return new ForbiddenError("Not authorized to modify this post.");
        }
        return await prisma.threadMessage.delete({
          where: {
            id,
          },
        });
      },
    });

    const AssignSubmissionInputType = inputObjectType({
      name: "AssignSubmissionInput",
      definition(t) {
        t.nonNull.string("rootId");
        t.nonNull.string("ownerId");
      },
    });
    t.field("assignSubmissionOwner", {
      type: "ReviewRequest",
      args: {
        input: nonNull(AssignSubmissionInputType),
      },
      resolve: async (_, { input: { rootId, ownerId } }, { user }) => {
        const submission = await prisma.reviewRequest.findUnique({
          where: {
            id: rootId,
          },
        });
        const prev = await prisma.reviewRequest.findFirst({
          where: {
            parentRequestId: rootId,
            userId: ownerId,
            type: ReviewRequestTypeEnum.CHAIR,
          },
        });
        if (prev) {
          if (prev.status === ReviewRequestStatusEnum.RELEASED) {
            throw Error("Must wait for chair to decline before re-assigning.");
          }
          // Delete existing assignment first.
          await prisma.reviewRequest.delete({
            where: {
              id: prev.id,
            },
          });
        }
        await prisma.reviewRequest.create({
          data: {
            status: ReviewRequestStatusEnum.RELEASED,
            type: ReviewRequestTypeEnum.CHAIR,
            note: "",
            parentRequest: {
              connect: {
                id: rootId,
              },
            },
            user: {
              connect: {
                id: ownerId,
              },
            },
            article: {
              connect: {
                id: submission.articleId,
              },
            },
            venue: {
              connect: {
                id: submission.venueId,
              },
            },
          },
        });
        return submission;
      },
    });

    const ChairRequestReviewInputType = inputObjectType({
      name: "ChairRequestReviewInput",
      definition(t) {
        t.nonNull.string("parentRequestId");
        t.nonNull.string("userId");
      },
    });
    t.field("chairRequestReview", {
      type: "ReviewRequest",
      args: {
        input: nonNull(ChairRequestReviewInputType),
      },
      resolve: async (_, { input: { parentRequestId, userId } }, { user }) => {
        const parent = await prisma.reviewRequest.findUnique({
          where: {
            id: parentRequestId,
          },
        });
        if (parent.userId !== user.id) {
          return new ForbiddenError("Not authorized to make this request.");
        }
        // const prev = await prisma.reviewRequest.findFirst({
        //   where: {
        //     parentRequestId: rootId,
        //     userId: ownerId,
        //     type: ReviewRequestTypeEnum.CHAIR,
        //   },
        // });
        await prisma.reviewRequest.create({
          data: {
            status: ReviewRequestStatusEnum.RELEASED,
            type: ReviewRequestTypeEnum.REVIEW,
            note: "",
            parentRequest: {
              connect: {
                id: parent.id,
              },
            },
            user: {
              connect: {
                id: userId,
              },
            },
            article: {
              connect: {
                id: parent.articleId,
              },
            },
            venue: {
              connect: {
                id: parent.venueId,
              },
            },
          },
        });
        return parent;
      },
    });

    const DeclineReviewRequestInputType = inputObjectType({
      name: "DeclineReviewRequestInput",
      definition(t) {
        t.nonNull.string("id");
        t.nullable.string("note");
      },
    });
    t.field("declineReviewRequest", {
      type: "ReviewRequest",
      args: {
        input: nonNull(DeclineReviewRequestInputType),
      },
      resolve: async (_, { input: { id, note } }, { user }) => {
        const reviewRequest = await prisma.reviewRequest.findUnique({
          where: {
            id,
          },
        });
        if (reviewRequest.userId !== user.id) {
          return new ForbiddenError("Not authorized to modify this request.");
        }
        return await prisma.reviewRequest.update({
          where: {
            id,
          },
          data: {
            status: ReviewRequestStatusEnum.DECLINED,
            note,
          },
        });
      },
    });

    t.field("publishMessage", {
      type: "ThreadMessage",
      args: {
        id: nonNull(stringArg()),
        body: nonNull(stringArg()),
        highlights: nonNull(jsonArg()),
      },
      resolve: async (_args, { id, body, highlights }, _ctx) => {
        const message = await prisma.threadMessage.findUnique({
          where: {
            id,
          },
        });
        const { authorId, articleId, type, venueId } = message;
        if (body.length === 0) {
          throw Error("Cannot publish an empty message.");
        }
        let identity = await prisma.identity.findFirst({
          where: {
            userId: authorId,
            articleId,
          },
        });
        if (!identity) {
          const context = messageTypeToIdentityContext(type);
          const articleIdentities = await prisma.identity.findMany({
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
          identity = await prisma.identity.create({
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
        return await prisma.threadMessage.update({
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
        { user }
      ) => {
        if (!authorIds.includes(user.id)) {
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
        const article = await prisma.article.create(input);
        if (venueId) {
          const sub = await prisma.reviewRequest.create({
            data: {
              type: ReviewRequestTypeEnum.ROOT,
              article: {
                connect: {
                  id: article.id,
                },
              },
              venue: {
                connect: {
                  id: venueId,
                },
              },
            },
          });
        }
        return article;
      },
    });
  },
});
