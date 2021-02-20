import prisma from "../lib/prisma";

async function main() {
  prisma.user.create({
    data: {
      id: "QGSLOdVc6yeA3HM8MNtdt9EYhHs1",
    },
  });
}
