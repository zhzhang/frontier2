import { objectType } from "nexus";

export default objectType({
  name: "User",
  definition(t) {
    t.string("id");
    t.string("name");
    t.nullable.string("profilePictureUrl");
    t.string("email");
    // t.model.email({
    //   authorize: ({ id }, _, ctx) => ctx.user.id === id,
    // });
    t.string("institution");
    t.string("twitter");
    t.string("website");
    // t.model.identities();
    // t.model.relations();
    // t.model.relationsAsTarget();
  },
});
