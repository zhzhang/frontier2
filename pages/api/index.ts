import { ApolloServer } from "apollo-server-micro";
import { GraphQLDate } from "graphql-iso-date";
import { applyMiddleware } from "graphql-middleware";
import { rule, shield } from "graphql-shield";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { asNexusMethod, makeSchema } from "nexus";
import jwt_decode from "jwt-decode";
import path from "path";
import prisma from "../../lib/prisma";
import { RoleEnum } from "../../lib/types";
import _ from "lodash";
import context from "react-bootstrap/esm/AccordionContext";
import { assertPrismaClientInContext } from "nexus-plugin-prisma/dist/utils";
import Query from "../../lib/api/queries";
import Mutation from "../../lib/api/mutations";
import {
  Role,
  User,
  Article,
  ArticleVersion,
  Venue,
  Organization,
  Review,
  ThreadMessage,
  Decision,
  Submission,
} from "../../lib/api/types";

export type Upload = Promise<FileUpload>;
export const Upload = asNexusMethod(GraphQLUpload!, "upload");

export const GQLDate = asNexusMethod(GraphQLDate, "date");

// Build the schema.
const rules = {
  isAuthenticated: rule()((_parent, _args, ctx) => {
    return Boolean(ctx.user);
  }),
};
export const permissions = shield({
  Mutation: rules.isAuthenticated,
});

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
    ThreadMessage,
    Decision,
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
