import { objectType } from "nexus";

export const Venue = objectType({
  name: "Venue",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.abbreviation();
    t.model.description();
    t.model.logoRef();
    t.model.organization();
    t.model.submissionDeadline();
    t.model.venueDate();
  },
});
export default Venue;
