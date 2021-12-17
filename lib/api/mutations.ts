import {
  booleanArg,
  list,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus";
import stream from "stream";
import { messageTypeToIdentityContext } from "./utils";

function s3UploadFromStream(bucket, key) {
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

function readStreamData(stream) {
  return new Promise(function (resolve, reject) {
    stream
      .on("data", (data) => console.log(data))
      .on("end", () => resolve(""))
      .on("error", reject);
    console.log("data listen hit");
  });
}

export default objectType({
  name: "Mutation",
  definition(t) {
    t.crud.updateOneUser({
      authorize: (_, { where: { id } }, ctx) => id === ctx.user.id,
    });
    t.crud.updateOneVenue({
      authorize: (_, { where: { id } }, ctx) => true,
    });
    t.crud.createOneVenueMembership({
      authorize: (_, args, ctx) => {
        console.log(ctx.user);
        return true;
      },
    });
    t.crud.deleteOneVenueMembership();
    t.crud.updateOneSubmission();
    t.crud.createOneReviewRequest();
    t.crud.createOneThreadMessage();
    t.field("publishMessage", {
      type: "ThreadMessage",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, ctx) => {
        const message = await ctx.prisma.threadMessage.findUnique({
          where: {
            id,
          },
        });
        const { authorId, articleId, type, venueId, headId } = message;
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
                  context: { equals: context },
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
            },
          });
        }
        return await ctx.prisma.threadMessage.update({
          where: {
            id,
          },
          data: {
            published: true,
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
    t.crud.upsertOneThreadMessage();
    t.crud.updateOneThreadMessage();
    t.crud.deleteOneThreadMessage();
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
            userId: authorId,
            authorNumber: index + 1,
          });
        }
        const input = {
          data: {
            title: title,
            authors: {
              create: authorCreationArgs,
            },
            anonymous,
            versions: {
              create: [
                {
                  abstract: abstract,
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
    t.crud.createOneRelation({
      authorize: (_, { data: { user } }, ctx) =>
        user.connect.id === ctx.user.id,
    });
    t.crud.deleteOneRelation({
      authorize: async (_, { where: { id } }, ctx) => {
        const relation = await ctx.prisma.relation.findUnique({
          where: {
            id,
          },
        });
        return relation.userId === ctx.user.id;
      },
    });
    t.crud.createOneVenue();
  },
});
