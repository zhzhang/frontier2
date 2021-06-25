import prisma from "@/lib/prisma";
import _ from "lodash";
import { objectType } from "nexus";

const Article = objectType({
  name: "Article",
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.anonymous();
    t.list.field("authors", {
      type: "User",
      resolve: (parent, _args, ctx) => {
        if (parent.anonymous) {
          return null;
        }
        return _.sortBy(parent.authors, ["authorNumber"]).map(
          (authorship) => authorship.user
        );
      },
    });
    t.model.versions({ pagination: false, filtering: { published: true } });
    t.model.reviews({ filtering: { published: true } });
    t.list.field("acceptedOrganizations", {
      type: "Organization",
      resolve: async (parent) => {
        const acceptances = await prisma.decision.findMany({
          where: { articleId: parent.id, decision: true },
          include: {
            organization: true,
          },
        });
        return acceptances.map((decision) => decision.organization);
      },
    });
  },
});

export default Article;
