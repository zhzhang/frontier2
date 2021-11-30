import { objectType } from "nexus";

const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.profilePictureUrl();
    t.model.email({
      authorize: ({ id }, _, ctx) => ctx.user.id === id,
    });
    t.model.institution();
    t.model.twitter();
    t.model.website();
    t.model.authorships();
    t.model.relations();
    t.model.relationsAsTarget();
  },
});

export default User;
