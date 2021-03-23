import prisma from "../prisma";
import { RoleEnum } from "../types";

export async function isOrganizationAdmin(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const adminMembership = await prisma.organizationMembership.findFirst({
    where: {
      userId,
      organizationId,
      role: RoleEnum.ADMIN,
    },
  });
  if (adminMembership) {
    return true;
  }
  return false;
}
