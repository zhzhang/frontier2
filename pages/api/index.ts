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
  objectType,
  arg,
  stringArg,
} from "nexus";
import jwt_decode from "jwt-decode";
import path from "path";
import prisma from "../../lib/prisma";

export type Upload = Promise<FileUpload>;
export const Upload = asNexusMethod(GraphQLUpload!, "upload");

export const GQLDate = asNexusMethod(GraphQLDate, "date");

const User = objectType({
  name: "User",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("email");
    t.list.field("articles", {
      type: "Article",
      resolve: (parent) =>
        prisma.user
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .posts(),
    });
  },
});

const Article = objectType({
  name: "Article",
  definition(t) {
    t.string("id");
    t.string("url");
    t.string("abstract");
    t.list.field("authors", {
      type: "User",
      resolve: (parent) => [],
    });
  },
});

const Organization = objectType({
  name: "Organization",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("description");
    t.list.field("admins", {
      type: "User",
      resolve: async (parent) => {
        return await prisma.membership.findMany({
          where: {
            role: "ADMIN",
            organization: parent,
          },
        });
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
        userId: nonNull(stringArg()),
      },
      resolve: (_, args) => {
        return prisma.user.findUnique({
          where: { id: args.userId },
        });
      },
    });
    t.list.field("articles", {
      type: "Article",
      args: {},
      resolve: (_, args, ctx) => {
        return prisma.article.findMany({
          where: { id: args.userId },
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
      resolve: (_, args) => {
        return prisma.organization.findMany();
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
        abstract: nonNull(stringArg()),
        authorIds: nonNull(list(nonNull(stringArg()))),
        fileData: nonNull(arg({ type: "Upload" })),
      },
      resolve: async (_, args) => {
        console.log(args);
        const {
          createReadStream,
          filename,
          mimetype,
          encoding,
        } = await args.fileData;
        console.log(filename);
        return null;
      },
    });
    t.field("createOrganization", {
      type: "Organization",
      args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
      },
      resolve: async (_, { name, description }, ctx) => {
        const organization = await prisma.organization.create({
          data: { name, description },
        });
        await prisma.membership.create({
          data: {
            userId: ctx.user.id,
            organizationId: organization.id,
            role: "ADMIN",
          },
        });
        return organization;
      },
    });
  },
});

// Build the schema.
const rules = {
  isAuthenticated: rule()((_parent, _args, ctx) => {
    if (Boolean(ctx.user)) {
      return Boolean(ctx.user.id);
    }
    return false;
  }),
};
export const permissions = shield({
  Mutation: {
    createArticle: rules.isAuthenticated,
    createOrganization: rules.isAuthenticated,
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, User, Article, Organization, GQLDate, Upload],
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
}

export default new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    if (token == "") {
      return;
    }
    const decoded: FirebaseToken = jwt_decode(token);
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
