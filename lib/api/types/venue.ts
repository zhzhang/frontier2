import { objectType } from "nexus";

const Venue = objectType({
  name: "Venue",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.abbreviation();
    t.model.websiteUrl();
    t.model.description();
    t.model.logoRef();
    t.model.submissionDeadline();
    t.model.venueDate();
  },
});
export default Venue;
