import {
  asNexusMethod,
  arg,
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
import AWS from "aws-sdk";
import { RoleEnum } from "../types";
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

  console.log("hit");

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
    t.field("createArticle", {
      type: "Article",
      args: {
        title: nonNull(stringArg()),
        abstract: nonNull(stringArg()),
        authorIds: nonNull(list(nonNull(stringArg()))),
        ref: nonNull(stringArg()),
        organizationId: nullable(stringArg()),
      },
      resolve: async (
        _,
        { title, abstract, authorIds, ref, organizationId },
        ctx
      ) => {
        const input = {
          data: {
            title: title,
            authors: {
              connect: authorIds.map((id) => ({
                id: id,
              })),
            },
            versions: {
              create: [
                {
                  abstract: abstract,
                  ref: ref,
                },
              ],
            },
          },
        };
        const article = await prisma.article.create(input);
        if (organizationId) {
          const sub = await prisma.submission.create({
            data: {
              articleId: article.id,
              organizationId,
            },
          });
        }
        return article;
      },
    });
    t.field("createOrganization", {
      type: "Organization",
      args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
        abbreviation: nullable(stringArg()),
        logoRef: nullable(stringArg()),
        // logoFile: nullable(arg({ type: "Upload" })),
      },
      resolve: async (_, { name, description, abbreviation, logoRef }, ctx) => {
        // const { createReadStream, filename, mimetype } = await logoFile;
        const organization = await prisma.organization.create({
          data: {
            name,
            description,
            logoRef,
            abbreviation,
            memberships: {
              create: [
                {
                  userId: ctx.user.id,
                  role: RoleEnum.ADMIN,
                },
              ],
            },
          },
        });
        return organization;
      },
    });
    t.field("updateOrganization", {
      type: "Organization",
      args: {
        id: nonNull(stringArg()),
        name: nullable(stringArg()),
        description: nullable(stringArg()),
        abbreviation: nullable(stringArg()),
        logoRef: nullable(stringArg()),
      },
      resolve: async (
        _,
        { id, name, description, abbreviation, logoRef },
        ctx
      ) => {
        const membership = await prisma.organizationMembership.findFirst({
          where: {
            userId: ctx.user.id,
            organizationId: id,
            role: RoleEnum.ADMIN,
          },
        });
        if (!membership) {
          return null;
        }
        const organization = await prisma.organization.update({
          where: {
            id,
          },
          data: {
            name,
            description,
            logoRef,
            abbreviation,
          },
        });
        return organization;
      },
    });
    t.field("assignChair", {
      type: "Submission",
      args: {
        submissionId: nonNull(stringArg()),
        chairId: nonNull(stringArg()),
      },
      resolve: async (_, { submissionId, chairId }, ctx) => {
        return await prisma.submission.update({
          where: {
            id: submissionId,
          },
          data: { chairId },
        });
      },
    });
    t.field("assignReviewers", {
      type: "Submission",
      args: {
        submissionId: nonNull(stringArg()),
        reviewerIds: nonNull(list(nonNull(stringArg()))),
      },
      resolve: async (_, { submissionId, reviewerIds }, ctx) => {
        return await prisma.submission.update({
          where: {
            id: submissionId,
          },
          data: {
            requestedReviewers: {
              connect: reviewerIds.map((id) => {
                return { id };
              }),
            },
          },
        });
      },
    });
    t.field("createReview", {
      type: "Review",
      args: {
        articleId: nonNull(stringArg()),
        submissionId: nullable(stringArg()),
      },
      resolve: async (_, { articleId, submissionId }, ctx) => {
        const prevReviews = await prisma.review.findMany({
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
        return await prisma.review.create({
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
          await prisma.review.update({
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
  },
});
