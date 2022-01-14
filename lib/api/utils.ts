import prisma from "@/lib/prisma";

export function messageTypeToIdentityContext(type: string): string {
  switch (type) {
    case "REVIEW":
      return "REVIEWER";
    case "DECISION":
      return "CHAIR";
  }
  return null;
}

export async function isAdmin(
  venueId: string,
  userId: string
): Promise<boolean> {
  const membership = await prisma.venueMembership.findFirst({
    where: {
      userId,
      venueId,
      role: "ADMIN",
    },
  });
  return Boolean(membership);
}
