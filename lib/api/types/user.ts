import { objectType } from "nexus";

const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();
    t.model.profilePictureUrl();
    t.list.field("articles", {
      type: "Article",
      resolve: (parent) => {
        return parent.articles;
      },
    });
  },
});

export default User;
