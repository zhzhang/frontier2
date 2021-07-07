import { enumType } from "nexus";

const Role = enumType({
  name: "Role",
  members: {
    ADMIN: "ADMIN",
    ACTION_EDITOR: "ACTION_EDITOR",
    NONE: "NONE",
  },
});

export default Role;
