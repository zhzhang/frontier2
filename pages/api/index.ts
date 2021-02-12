import { ApolloServer } from "apollo-server-micro";
import { GraphQLDate } from "graphql-iso-date";
import {
  asNexusMethod,
  makeSchema,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus";
import jwt_decode from "jwt-decode";
import path from "path";
import prisma from "../../lib/prisma";

export const GQLDate = asNexusMethod(GraphQLDate, "date");

const User = objectType({
  name: "User",
  definition(t) {
    t.int("id");
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
    t.int("id");
    t.string("url");
    t.string("abstract");
    t.list.field("authors", {
      type: "User",
      resolve: (parent) => [],
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
    t.field("articles", {
      type: "Article",
      args: {},
      resolve: (_, args, ctx) => {
        console.log(ctx);
        return prisma.article.findMany({
          where: { id: args.userId },
        });
      },
    });
  },
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("signupUser", {
      type: "User",
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
      },
      resolve: (_, { name, email }, ctx) => {
        return prisma.user.create({});
      },
    });
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, User, Article, GQLDate],
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

export default new ApolloServer({
  schema,
  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    const decoded = jwt_decode(token);
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
        return { newUser };
      }
      return { user };
    }
  },
}).createHandler({
  path: "/api",
});
