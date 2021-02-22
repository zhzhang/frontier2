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
  const reviewer = await prisma.user.create({
    data: {
      id: "DO66T35YeDSS15NQga5XYOeGqyg4",
      email: "john.doe@frontier.pub",
      name: "John Doe",
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
  const otherOrganization = await prisma.organization.create({
    data: {
      name: "Frontier Open Review",
      description: `<p><span style="color: rgb(51, 51, 51);">Frontier.pub open-reviewed journal.</span></p>`,
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
  const abstract =
    "<p>Automatic hypernymy detection is a crucial task in machine understand of natural languages, with applications in information extraction and question answering. Much of the work in unsupervised hypernymy detection revolves around the distributional semantic model (DSM) framework, in particular the representation of words as vectors in Vector Space Models (VSMs). Based on the hypothesis that hypernyms should be able to substitute for their hyponyms in most natural context, researchers have devised various asymmetric measures which quantify the overlap of context features as indicators of hypernymy. However, most VSMs make the strong assumption that individual context features occur independently of each other, which can lead to nonsensical results in hypernymy detection when the various contexts in which a word may found in a corpus are conflated. The proposed solution is to use density matrices, which make no independence assumptions about the context feature direction and can thus represent encode information about the original sentences in a corpus. In this thesis we present the first full-scale implementations of quantum density matrices as a distributional semantic model. We apply the density matrix model to the hypernymy detection problem and implement several quantum versions of previous asymmetric measures, many of which are novel adaptations. We show that density matrices perform reasonably well on three tasks in hypernymy detection, despite the simplicity of our context models, achieving an accuracy of 57.2% in the hypernymy direction task, and a precision of 61.9% in the hypernymy precision task using random noun pairs. Furthermore, we prove through a qualitative analysis that density matrices can indeed encode disparate word usages where VSMs cannot</p>";
  const ref = "articles/7fcb70aa-af7e-4c45-9bce-e194c8dc8329.pdf";
  const article = await prisma.article.create({
    data: {
      id: "cklgwx4zu000058v2vz52cajm",
      title: "Density Matrices for Lexical Entailment",
      authors: {
        connect: [{ id: user.id }],
      },
      versions: {
        create: [
          {
            abstract: abstract,
            ref: ref,
            versionNumber: 1,
          },
          {
            abstract: abstract,
            ref: ref,
            versionNumber: 2,
          },
        ],
      },
    },
  });

  const metaReview = await prisma.metaReview.create({
    data: {
      authorId: reviewer.id,
      body: `<p><span style="color: rgb(51, 51, 51);">Meta-reviews may cite reviews from any source.</span></p>`,
      decision: true,
      articleId: article.id,
      organizationId: organization.id,
      citedReviews: {
        create: [
          {
            authorId: reviewer.id,
            reviewNumber: 1,
            articleId: article.id,
            published: true,
            organizationId: organization.id,
          },
          {
            authorId: reviewer.id,
            reviewNumber: 2,
            articleId: article.id,
            published: true,
            organizationId: otherOrganization.id,
          },
        ],
      },
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
