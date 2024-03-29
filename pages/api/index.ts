import Mutation from "@/lib/api/mutations";
import Query from "@/lib/api/queries";
import Article from "@/lib/api/types/article";
import ArticleVersion from "@/lib/api/types/articleVersion";
import { JSON } from "@/lib/api/types/json";
import Relation, { RelationType } from "@/lib/api/types/relation";
import ReviewRequest from "@/lib/api/types/reviewRequest";
import Role from "@/lib/api/types/role";
import ThreadMessage, {
  ThreadMessageType,
} from "@/lib/api/types/threadMessage";
import User from "@/lib/api/types/user";
import Venue from "@/lib/api/types/venue";
import VenueMembership from "@/lib/api/types/venueMembership";
import { GraphQLDateTime } from "@/lib/graphql-iso-date";
import prisma from "@/lib/prisma";
import { ApolloServer, GraphQLUpload } from "apollo-server-micro";
import { rule, shield } from "graphql-shield";
import jwt_decode from "jwt-decode";
import { asNexusMethod, fieldAuthorizePlugin, makeSchema } from "nexus";
import path from "path";

export const Upload = asNexusMethod(GraphQLUpload, "upload");

// Build the schema.
const rules = {
  isAuthenticated: rule()((_parent, _args, ctx) => {
    return Boolean(ctx.user);
  }),
};
export const permissions = shield(
  {
    Mutation: rules.isAuthenticated, // Mutations only allowed for logged-in users.
  },
  { debug: true }
);

export const schema = makeSchema({
  plugins: [fieldAuthorizePlugin()],
  types: [
    GraphQLDateTime,
    Query,
    Mutation,
    User,
    Article,
    ArticleVersion,
    Venue,
    ReviewRequest,
    Relation,
    RelationType,
    ThreadMessage,
    ThreadMessageType,
    VenueMembership,
    Role,
    Upload,
    JSON,
  ],
  outputs: {
    typegen: path.join(process.cwd(), "pages/api/nexus-typegen.ts"),
    schema: path.join(process.cwd(), "pages/api/schema.graphql"),
  },
  // sourceTypes: {
  //   modules: [
  //     {
  //       module: require.resolve(".prisma/client/index.d.ts"),
  //       alias: "prisma",
  //     },
  //   ],
  // },
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
  schema,
  context: async ({ req }) => {
    const ctx = { prisma };
    const token = req.headers.authorization || "";
    if (token == "") {
      return ctx;
    }
    const decoded: FirebaseToken = jwt_decode(token);
    if (Math.floor(Date.now() / 1000) > decoded.exp) {
      console.log("Token expired");
      return ctx;
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
        return { user: newUser, ...ctx };
      }
      return { user, ...ctx };
    }
  },
}).createHandler({
  path: "/api",
});
