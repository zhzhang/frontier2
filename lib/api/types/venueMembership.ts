import { objectType } from "nexus";

const VenueMembership = objectType({
  name: "VenueMembership",
  definition(t) {
    t.model.id();
    t.model.role();
    t.model.user();
    t.model.venue();
  },
});
export default VenueMembership;
