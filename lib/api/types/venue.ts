import { objectType } from "nexus";

export const Venue = objectType({
  name: "Venue",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("abbreviation");
  },
});
export default Venue;
