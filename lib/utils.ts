export function userFromIdentity({ user, context, number }) {
  if (user) {
    return user;
  }
  return {
    id: "anonymous",
    name: `${context[0] + context.substring(1).toLowerCase()} ${number}`,
  };
}
