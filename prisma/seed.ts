import prisma from "../lib/prisma";
import { RoleEnum } from "../lib/types";

async function main() {
  const user = await prisma.user.create({
    data: {
      id: "DO66T35YeDSS15NQga5XYOeGqyg2",
      email: "jordan@frontier.pub",
      name: "Jordan Zhang",
    },
  });
  const organization = await prisma.organization.create({
    data: {
      id: "cklhou5t30000wpfwuehicxyu",
      name: "Association for Computational Linguistics",
      description: `<p><span style="color: rgb(51, 51, 51);">The&nbsp;</span><strong style="color: rgb(51, 51, 51);">Association for Computational Linguistics&nbsp;(ACL) </strong><span style="color: rgb(51, 51, 51);">is the premier international scientific and professional society for people working on computational problems involving human language, a field often referred to as either computational linguistics or natural language processing (NLP). The association was founded in 1962, originally named the&nbsp;Association for Machine Translation and Computational Linguistics&nbsp;(AMTCL), and became the ACL in 1968. Activities of the ACL include the holding of an annual meeting each summer and the sponsoring of the journal&nbsp;</span><em style="color: rgb(51, 51, 51);">Computational Linguistics,&nbsp;</em><span style="color: rgb(51, 51, 51);">published by MIT Press; this conference and journal are the leading publications of the field. For more information, see:&nbsp;</span><a href="https://www.aclweb.org/" rel="noopener noreferrer" target="_blank" style="color: rgb(204, 0, 0); background-color: rgb(255, 255, 255);">https://www.aclweb.org/</a><span style="color: rgb(51, 51, 51);">.&nbsp;</span></p>`,
      logoRef: "logos/b501498d-a03f-4e8d-9aaf-0d5068cd59cd",
    },
  });
  await prisma.organizationMembership.create({
    data: {
      userId: user.id,
      organizationId: organization.id,
      role: RoleEnum.ADMIN,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
