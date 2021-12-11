export function userFromIdentity({ user, context, number }) {
  if (user) {
    return user;
  }
  return {
    id: "anonymous",
    name: `${context} ${number}`,
  };
}
