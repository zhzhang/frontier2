export function messageTypeToIdentityContext(type: string): string {
  switch (type) {
    case "REVIEW":
      return "REVIEWER";
    case "DECISION":
      return "CHAIR";
  }
  return null;
}
