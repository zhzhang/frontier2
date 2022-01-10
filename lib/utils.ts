export function userFromIdentity({ user, context, number }) {
  if (user) {
    return user;
  }
  return {
    id: "anonymous",
    name: `${context[0] + context.substring(1).toLowerCase()} ${number}`,
  };
}

export function formatVenueAbbreviation(venue) {
  const { abbreviation, venueDate } = venue;
  let abbrev;
  if (abbreviation) {
    abbrev = abbreviation;
    if (venueDate) {
      const parsedVenueDate = new Date(venueDate);
      abbrev += ` ${parsedVenueDate.getFullYear()}`;
    }
  }
  return abbrev;
}
