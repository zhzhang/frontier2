import {
  booleanArg,
  intArg,
  list,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus";
import stream from "stream";

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
        throw Error("Test Error");
        if (!authorIds.includes(ctx.user.id)) {
          throw Error("User must be an author.");
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
        console.log(venueId);
        if (venueId) {
          const sub = await ctx.prisma.submission.create({
            data: {
              articleId: article.id,
              venueId,
            },
          });
          console.log("hit");
        }
        return article;
      },
    });
    t.field("createReview", {
      type: "Review",
      args: {
        articleId: nonNull(stringArg()),
        submissionId: nullable(stringArg()),
      },
      resolve: async (_, { articleId, submissionId }, ctx) => {
        const prevReviews = await ctx.prisma.review.findMany({
          where: {
            articleId,
          },
        });
        const reviewNumber =
          prevReviews.length === 0
            ? 1
            : _.max(prevReviews.map((review) => review.reviewNumber)) + 1;
        const data = {
          articleId,
          reviewNumber,
          authorId: ctx.user.id,
        };
        if (submissionId !== null && submissionId !== undefined) {
          data.submissionId = submissionId;
        }
        return await ctx.prisma.review.create({
          data,
        });
      },
    });
    t.field("updateReview", {
      type: "Review",
      args: {
        id: nonNull(stringArg()),
        body: nonNull(stringArg()),
        rating: nonNull(intArg()),
        published: nonNull(booleanArg()),
      },
      resolve: async (_, { id, body, rating, published }, ctx) => {
        try {
          await ctx.prisma.review.update({
            where: {
              id: id,
            },
            data: { body, rating, published },
          });
        } catch (e) {
          console.log(e);
        }
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
    t.crud.createOneThreadMessage();
  },
});
