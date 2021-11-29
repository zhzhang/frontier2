import { objectType } from "nexus";

const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email({
      authorize: ({ id }, _, ctx) => ctx.user.id === id,
    });
    t.model.profilePictureUrl();
    t.list.field("articles", {
      type: "Article",
      resolve: (parent) => {
        return parent.articles;
      },
    });
    t.model.relations();
    t.model.relationsAsTarget();
  },
});

export default User;
