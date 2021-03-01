import { ApolloServer } from "apollo-server-micro";
import { GraphQLDate } from "graphql-iso-date";
import { applyMiddleware } from "graphql-middleware";
import { rule, shield } from "graphql-shield";
import { GraphQLUpload, FileUpload } from "graphql-upload";
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
import jwt_decode from "jwt-decode";
import path from "path";
import prisma from "../../lib/prisma";
import { RoleEnum } from "../../lib/types";
import _ from "lodash";
import context from "react-bootstrap/esm/AccordionContext";

export type Upload = Promise<FileUpload>;
export const Upload = asNexusMethod(GraphQLUpload!, "upload");

export const GQLDate = asNexusMethod(GraphQLDate, "date");

export const Role = enumType({
  name: "Role",
  members: {
    REVIEWER: "REVIEWER",
    MEMBER: "MEMBER",
    ADMIN: "ADMIN",
    NONE: "NONE",
  },
});

const User = objectType({
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

const Article = objectType({
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
        return parent.authors;
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
  },
});

const ArticleVersion = objectType({
  name: "ArticleVersion",
  definition(t) {
    t.string("id");
    t.string("ref");
    t.string("abstract");
    t.string("createdAt");
    t.int("versionNumber");
  },
});

const Venue = objectType({
  name: "Venue",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("abbreviation");
  },
});

const Organization = objectType({
  name: "Organization",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("description");
    t.string("abbreviation");
    t.string("logoRef");
    t.field("role", {
      type: Role,
      resolve: async (_, parent, ctx) => {
        if (!ctx.user) {
          return RoleEnum.NONE;
        }
        const membership = await prisma.organizationMembership.findFirst({
          where: {
            organizationId: parent.id,
            userId: ctx.user.id,
          },
        });
        return membership.role;
      },
    });
    t.list.field("venues", {
      type: "Venue",
      resolve: (parent) => {},
    });
    t.list.field("accepted", {
      type: "MetaReview",
      resolve: async (parent) => {
        return await prisma.metaReview.findMany({
          where: {
            organizationId: parent.id,
            decision: true,
          },
          include: {
            author: true,
            article: {
              include: {
                authors: true,
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

const Review = objectType({
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
  },
});

const MetaReview = objectType({
  name: "MetaReview",
  definition(t) {
    t.string("id");
    t.string("body");
    t.boolean("decision");
    t.field("author", { type: "User" });
    t.field("article", { type: "Article" });
    t.list.field("citedReviews", { type: "Review" });
  },
});

const Submission = objectType({
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

const Query = objectType({
  name: "Query",
  definition(t) {
    t.field("user", {
      type: "User",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_, { id }) => {
        return prisma.user.findUnique({
          where: { id },
          include: {
            articles: {
              include: {
                versions: true,
                authors: true,
              },
            },
          },
        });
      },
    });
    t.field("article", {
      type: "Article",
      args: { id: nonNull(stringArg()) },
      resolve: async (_, { id }, ctx) => {
        return await prisma.article.findUnique({
          where: {
            id,
          },
          include: {
            versions: true,
            authors: true,
            reviews: {
              include: {
                organization: true,
              },
            },
          },
        });
      },
    });
    t.list.field("articles", {
      type: "Article",
      args: {},
      resolve: async (_, args, ctx) => {
        return await prisma.article.findMany({
          include: {
            versions: true,
            authors: true,
          },
        });
      },
    });
    t.field("organization", {
      type: "Organization",
      args: { id: nonNull(stringArg()) },
      resolve: (_, args) => {
        return prisma.organization.findUnique({
          where: { id: args.id },
        });
      },
    });
    t.list.field("browseOrganizations", {
      type: "Organization",
      args: { tags: list(stringArg()) },
      resolve: (_, _args) => {
        return prisma.organization.findMany();
      },
    });
    t.list.field("searchUsers", {
      type: "User",
      args: { query: stringArg() },
      resolve: async (_, { query }) => {
        return await prisma.user.findMany({
          where: {
            name: {
              contains: query,
            },
          },
        });
      },
    });
    t.list.field("reviewerAssignedSubmissions", {
      type: "Submission",
      resolve: async (_, _args, ctx) => {
        const user = await prisma.user.findUnique({
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

const Mutation = objectType({
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
        // fileData: nonNull(arg({ type: "Upload" })),
      },
      resolve: async (
        _,
        { title, abstract, authorIds, ref, organizationId },
        ctx
      ) => {
        // const {
        //   createReadStream,
        //   filename,
        //   mimetype,
        //   encoding,
        // } = await args.fileData;
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
        logoRef: nullable(stringArg()),
      },
      resolve: async (_, { name, description, logoRef }, ctx) => {
        const organization = await prisma.organization.create({
          data: { name, description, logoRef },
        });
        await prisma.organizationMembership.create({
          data: {
            userId: ctx.user.id,
            organizationId: organization.id,
            role: RoleEnum.ADMIN,
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

// Build the schema.
const rules = {
  isAuthenticated: rule()((_parent, _args, ctx) => {
    return Boolean(ctx.user);
  }),
};
// export const permissions = shield({
//   Mutation: rules.isAuthenticated,
// });

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    User,
    Article,
    ArticleVersion,
    Organization,
    Venue,
    Submission,
    Review,
    MetaReview,
    Role,
    GQLDate,
    Upload,
  ],
  outputs: {
    typegen: path.join(process.cwd(), "pages/api/nexus-typegen.ts"),
    schema: path.join(process.cwd(), "pages/api/schema.graphql"),
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

interface FirebaseToken {
  user_id: string;
  email: string;
  name: string;
  exp: number;
}

export default new ApolloServer({
  // schema: applyMiddleware(schema, permissions),
  schema: schema,
  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    if (token == "") {
      return;
    }
    const decoded: FirebaseToken = jwt_decode(token);
    if (Math.floor(Date.now() / 1000) > decoded.exp) {
      console.log("Token expired");
      return;
    }
    // Add the user to the back end DB if they don't exist yet.
    if (decoded.user_id) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.user_id },
      });
      if (user == null) {
        const newUser = await prisma.user
          .create({
            data: {
              id: decoded.user_id,
              email: decoded.email,
              name: decoded.name,
            },
          })
          .catch((error) => console.log(error));
        return { user: newUser };
      }
      return { user };
    }
  },
}).createHandler({
  path: "/api",
});
