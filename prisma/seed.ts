import cuid from "cuid";
import prisma from "../lib/prisma";
import { RoleEnum } from "../lib/types";

function createEditorState(text: string) {
  return `{"blocks":[{"key":"q1g7","text":"${text}","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`;
}

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
  const user5 = await prisma.user.create({
    data: {
      id: cuid(),
      email: "chris@christianbentz.de",
      name: "Christian Bentz",
    },
  });
  const user6 = await prisma.user.create({
    data: {
      id: cuid(),
      email: "kate.knill@eng.cam.ac.uk",
      name: "Kate Knill",
    },
  });
  const user7 = await prisma.user.create({
    data: {
      id: cuid(),
      email: "marek.rei@imperial.ac.uk",
      name: "Marek Rei",
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
    "We address the task of automatically grading the language proficiency of spontaneous speech based on textual features from automatic speech recognition transcripts. Motivated by recent advances in multi-task learning, we develop neural networks trained in a multi-task fashion that learn to predict the proficiency level of non-native English speakers by taking advantage of inductive transfer between the main task (grading) and auxiliary prediction tasks: morpho-syntactic labeling, language modeling, and native language identification (L1). We encode the transcriptions with both bi-directional recurrent neural networks and with bi-directional representations from transformers, compare against a feature-rich baseline, and analyse performance at different proficiency levels and with transcriptions of varying error rates. Our best performance comes from a transformer encoder with L1 prediction as an auxiliary task. We discuss areas for improvement and potential applications for text-only speech scoring.";
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
  const reviewBody =
    "Easily write your reviews with a fully featured markdown text editor:\n\n - Rich text formatting: *italics* **bold**. \n\n - Formulas $f(x) = x^{2}$ \n $$\nH(p,q)=-\\sum\\limits_{x\\in\\chi}p(x)\\log q(x)\n$$\n - PDF annotation. [This]{1} highlight refers to the most recent version of the article, while [this]{2} highlight refers to a previous version.";
  const highlights = `[{"boundingRect":{"x1":86,"y1":554.8,"x2":350.7,"y2":683.2,"width":714.3,"height":1010.3},"rects":[{"x1":99.5,"y1":554.8,"x2":348.4,"y2":569.4,"width":714.3,"height":1010.3},{"x1":86.4,"y1":571.1,"x2":347.8,"y2":585.6,"width":714.3,"height":1010.3},{"x1":86.4,"y1":587.3,"x2":348.9,"y2":601.9,"width":714.3,"height":1010.3},{"x1":86.4,"y1":603.6,"x2":348.4,"y2":618.2,"width":714.3,"height":1010.3},{"x1":86.4,"y1":619.9,"x2":350.7,"y2":634.4,"width":714.3,"height":1010.3},{"x1":86,"y1":636.1,"x2":348.4,"y2":650.7,"width":714.3,"height":1010.3},{"x1":86.4,"y1":652.4,"x2":348.4,"y2":666.9,"width":714.3,"height":1010.3},{"x1":86.4,"y1":668.6,"x2":340.5,"y2":683.2,"width":714.3,"height":1010.3}],"pageNumber":2,"id":1,"articleVersion":2},{"boundingRect":{"x1":368.3,"y1":512.8,"x2":632.9,"y2":787.7,"width":714.3,"height":1010.3},"rects":[{"x1":368.3,"y1":512.8,"x2":630.7,"y2":527.3,"width":714.3,"height":1010.3},{"x1":368.7,"y1":529.2,"x2":630.7,"y2":543.8,"width":714.3,"height":1010.3},{"x1":368.3,"y1":545.5,"x2":632.4,"y2":560,"width":714.3,"height":1010.3},{"x1":368.7,"y1":561.7,"x2":630.7,"y2":576.3,"width":714.3,"height":1010.3},{"x1":368.7,"y1":578,"x2":630.7,"y2":592.5,"width":714.3,"height":1010.3},{"x1":368.7,"y1":594.3,"x2":632.9,"y2":608.8,"width":714.3,"height":1010.3},{"x1":368.7,"y1":610.5,"x2":630.3,"y2":625.1,"width":714.3,"height":1010.3},{"x1":368.7,"y1":626.8,"x2":630.7,"y2":641.3,"width":714.3,"height":1010.3},{"x1":424.6,"y1":631.9,"x2":427.2,"y2":641,"width":714.3,"height":1010.3},{"x1":368.7,"y1":643,"x2":632.9,"y2":657.6,"width":714.3,"height":1010.3},{"x1":368.7,"y1":659.3,"x2":631.1,"y2":673.8,"width":714.3,"height":1010.3},{"x1":368.7,"y1":675.6,"x2":631,"y2":690.1,"width":714.3,"height":1010.3},{"x1":368.7,"y1":691.8,"x2":632.9,"y2":706.3,"width":714.3,"height":1010.3},{"x1":368.7,"y1":708.1,"x2":630.9,"y2":722.6,"width":714.3,"height":1010.3},{"x1":368.7,"y1":724.3,"x2":630.7,"y2":738.9,"width":714.3,"height":1010.3},{"x1":368.7,"y1":740.6,"x2":630.7,"y2":755.1,"width":714.3,"height":1010.3},{"x1":368.7,"y1":756.8,"x2":630.5,"y2":771.4,"width":714.3,"height":1010.3},{"x1":368.7,"y1":773.1,"x2":499.6,"y2":787.7,"width":714.3,"height":1010.3}],"pageNumber":4,"id":2,"articleVersion":1}]`;

  const review1 = await prisma.review.create({
    data: {
      authorId: reviewer.id,
      reviewNumber: 1,
      articleId: article.id,
      published: true,
      organizationId: organization.id,
      rating: 1,
      anonymized: false,
      highlights: "[]",
      body: "Test review!!!",
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
      highlights: highlights,
    },
  });
  await prisma.threadMessage.create({
    data: {
      headId: review2.id,
      userId: andrew.id,
      body: `Author responses and other discussion on public reviews can be viewed in a thread below the review.`,
      highlights: "[]",
    },
  });

  const decision = await prisma.decision.create({
    data: {
      authorId: reviewer.id,
      body: `This is an example meta-review. Reviews that an author cites in writing the meta-review are attached to the meta-review, and directly credit the reviewer. Reviews from other organizations can be cited as well!`,
      highlights: "",
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

  // Second Article
  const article2 = await prisma.article.create({
    data: {
      title: "Grammatical Error Detection in Transcriptions of Spoken English",
      authors: {
        create: [
          { authorNumber: 1, user: { connect: { id: andrew.id } } },
          { authorNumber: 2, user: { connect: { id: user5.id } } },
          { authorNumber: 3, user: { connect: { id: user6.id } } },
          { authorNumber: 4, user: { connect: { id: user7.id } } },
          { authorNumber: 5, user: { connect: { id: user3.id } } },
        ],
      },
      versions: {
        create: [
          {
            abstract:
              "We describe the collection of transcription corrections and grammatical error annotations for the CROWDED Corpus of spoken English monologues on business topics. The corpus recordings were crowdsourced from native speakers of English and learners of English with German as their first language. The new transcriptions and annotations are obtained from different crowdworkers: we analyse the 1108 new crowdworker submissions and propose that they can be used for automatic transcription post-editing and grammatical error correction for speech. To further explore the data we train grammatical error detection models with various configurations including pretrained and contextual word representations as input, additional features and auxiliary objectives, and extra training data from written error-annotated corpora. We find that a model concatenating pre-trained and contextual word representations as input performs best, and that additional information does not lead to further performance gains",
            ref: "articles/CrowdED_GED.pdf",
            versionNumber: 1,
            createdAt: "2020-01-06T12:00:00.000Z",
          },
        ],
      },
      anonymous: true,
    },
  });

  await prisma.submission.create({
    data: {
      articleId: article2.id,
      organizationId: organization.id,
    },
  });

  const venue = await prisma.venue.create({
    data: {
      name: "Annual Meeting of the Association for Computational Linguistics",
      abbreviation: "ACL",
      description: "SubmissionTargetTypeahed",
      organizationId: organization.id,
      submissionDeadline: "2022-06-05T10:00:00.000Z",
      venueDate: "2022-06-10T10:00:00.000Z",
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
