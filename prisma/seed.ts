import { Auth0Provider } from "use-auth0-hooks";
import prisma from "../lib/prisma";
import { RoleEnum } from "../lib/types";
import cuid from "cuid";

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

  // Andrew Caines
  const andrew = await prisma.user.create({
    data: {
      id: cuid(),
      email: "andrew.caines@cl.cam.ac.uk",
      name: "Andrew Caines",
    },
  });
  const user2 = await prisma.user.create({
    data: {
      id: cuid(),
      email: "hjc68@cl.cam.ac.uk",
      name: "Hannah Craighead",
    },
  });
  const user3 = await prisma.user.create({
    data: {
      id: cuid(),
      email: "paula.buttery@cl.cam.ac.uk",
      name: "Paula Buttery",
    },
  });
  const user4 = await prisma.user.create({
    data: {
      id: cuid(),
      email: "hellen.yannakoudakis@cl.cam.ac.uk",
      name: "Helen Yannakoudakis",
    },
  });

  // ORGANIZATION
  const organization = await prisma.organization.create({
    data: {
      id: "cklhou5t30000wpfwuehicxyu",
      name: "Association for Computational Linguistics",
      abbreviation: "ACL",
      description: `The Association for Computational Linguistics (ACL) is the premier international scientific and professional society for people working on computational problems involving human language, a field often referred to as either computational linguistics or natural language processing (NLP). The association was founded in 1962, originally named the Association for Machine Translation and Computational Linguistics (AMTCL), and became the ACL in 1968. Activities of the ACL include the holding of an annual meeting each summer and the sponsoring of the journal Computational Linguistics, published by MIT Press; this conference and journal are the leading publications of the field. For more information, see: https://www.aclweb.org/. `,
      logoRef: "logos/b501498d-a03f-4e8d-9aaf-0d5068cd59cd",
    },
  });
  const otherOrganization = await prisma.organization.create({
    data: {
      name: "International Conference on Learning Representations",
      abbreviation: "ICLR",
      description: `The International Conference on Learning Representations (ICLR) is the premier gathering of professionals dedicated to the advancement of the branch of artificial intelligence called representation learning, but generally referred to as deep learning. ICLR is globally renowned for presenting and publishing cutting-edge research on all aspects of deep learning used in the fields of artificial intelligence, statistics and data science, as well as important application areas such as machine vision, computational biology, speech recognition, text understanding, gaming, and robotics.`,
      logoRef: "logos/Mt1ozX07_400x400.jpg",
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
    "<p>We address the task of automatically grading the language proficiency of spontaneous speech based on textual features from automatic speech recognition transcripts. Motivated by recent advances in multi-task learning, we develop neural networks trained in a multi-task fashion that learn to predict the proficiency level of non-native English speakers by taking advantage of inductive transfer between the main task (grading) and auxiliary prediction tasks: morpho-syntactic labeling, language modeling, and native language identification (L1). We encode the transcriptions with both bi-directional recurrent neural networks and with bi-directional representations from transformers, compare against a feature-rich baseline, and analyse performance at different proficiency levels and with transcriptions of varying error rates. Our best performance comes from a transformer encoder with L1 prediction as an auxiliary task. We discuss areas for improvement and potential applications for text-only speech scoring.</p>";
  const article = await prisma.article.create({
    data: {
      id: "cklgwx4zu000058v2vz52cajm",
      title:
        "Investigating the Effect of Auxiliary Objectives for the Automated Grading of Learner English Speech Transcriptions",
      authors: {
        create: [
          { authorNumber: 1, user: { connect: { id: user2.id } } },
          { authorNumber: 2, user: { connect: { id: andrew.id } } },
          { authorNumber: 3, user: { connect: { id: user3.id } } },
          { authorNumber: 4, user: { connect: { id: user4.id } } },
        ],
      },
      versions: {
        create: [
          {
            abstract: abstract,
            ref: "articles/ACL2020_SpeechScoring.pdf",
            versionNumber: 1,
            createdAt: "2020-01-06T12:00:00.000Z",
          },
          {
            abstract: abstract,
            ref: "articles/ACL2020_SpeechScoring_camera_ready.pdf",
            versionNumber: 2,
            createdAt: "2020-06-11T12:00:00.000Z",
          },
        ],
      },
      anonymous: false,
    },
  });

  const tmp = prisma.articleAuthor.create({
    data: {
      user: { connect: { id: user2.id } },
      article: { connect: { id: article.id } },
      authorNumber: 1,
    },
  });
  const reviewBody = "Markdown text editor.";

  const review1 = await prisma.review.create({
    data: {
      authorId: reviewer.id,
      reviewNumber: 1,
      articleId: article.id,
      published: true,
      organizationId: organization.id,
      rating: 1,
      canAccess: false,
      body: "",
    },
  });
  const review2 = await prisma.review.create({
    data: {
      authorId: reviewer.id,
      reviewNumber: 2,
      articleId: article.id,
      published: true,
      organizationId: otherOrganization.id,
      body: reviewBody,
      rating: 3,
    },
  });
  await prisma.threadMessage.create({
    data: {
      reviewId: review2.id,
      userId: andrew.id,
      body: `<p><span style="color: rgb(51, 51, 51Y);">Author rebuttals and other discussion on public reviews can be viewed in a thread below the review.</span></p>`,
    },
  });

  const decision = await prisma.decision.create({
    data: {
      authorId: reviewer.id,
      body: `<p><span style="color: rgb(51, 51, 51Y);">This is an example meta-review. Reviews that a author cites in writing the meta-review are attached to the meta-review. Reviews from other organizations can be cited as well!</span></p>`,
      decision: true,
      articleId: article.id,
      organizationId: organization.id,
    },
  });
  await prisma.decision.update({
    where: { id: decision.id },
    data: {
      citedReviews: {
        connect: [{ id: review1.id }, { id: review2.id }],
      },
    },
  });

  prisma.submission.create({
    data: {
      articleId: article.id,
      organizationId: organization.id,
    },
  });

  const venue = await prisma.venue.create({
    data: {
      name:
        "57th Annual Meeting of the Association for Computational Linguistics",
      abbreviation: "ACL 2019",
      organizationId: organization.id,
      date: "2019-06-05T10:00:00.000Z",
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
