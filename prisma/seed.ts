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
  const highlights = `[{"boundingRect":{"x1":85.99429321289062,"y1":554.8295135498047,"x2":350.69952392578125,"y2":683.1817932128906,"width":714.3312,"height":1010.2679999999999},"rects":[{"x1":99.48861694335938,"y1":554.8295135498047,"x2":348.40771484375,"y2":569.3749694824219,"width":714.3312,"height":1010.2679999999999},{"x1":86.39202880859375,"y1":571.0937194824219,"x2":347.75201416015625,"y2":585.63916015625,"width":714.3312,"height":1010.2679999999999},{"x1":86.39202880859375,"y1":587.3437194824219,"x2":348.8697509765625,"y2":601.88916015625,"width":714.3312,"height":1010.2679999999999},{"x1":86.39202880859375,"y1":603.60791015625,"x2":348.41595458984375,"y2":618.1533813476562,"width":714.3312,"height":1010.2679999999999},{"x1":86.39202880859375,"y1":619.85791015625,"x2":350.69952392578125,"y2":634.4033813476562,"width":714.3312,"height":1010.2679999999999},{"x1":85.99429321289062,"y1":636.1221313476562,"x2":348.40985107421875,"y2":650.6675720214844,"width":714.3312,"height":1010.2679999999999},{"x1":86.39202880859375,"y1":652.3863220214844,"x2":348.41339111328125,"y2":666.9317932128906,"width":714.3312,"height":1010.2679999999999},{"x1":86.39202880859375,"y1":668.6363220214844,"x2":340.47161865234375,"y2":683.1817932128906,"width":714.3312,"height":1010.2679999999999}],"pageNumber":2,"id":1,"articleVersion":2},{"boundingRect":{"x1":368.25282287597656,"y1":512.7983016967773,"x2":632.9170684814453,"y2":787.6562118530273,"width":714.3312,"height":1010.2679999999999},"rects":[{"x1":368.25282287597656,"y1":512.7983016967773,"x2":630.7073516845703,"y2":527.3437118530273,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":529.2187118530273,"x2":630.7371368408203,"y2":543.7641830444336,"width":714.3312,"height":1010.2679999999999},{"x1":368.25282287597656,"y1":545.4829330444336,"x2":632.3643951416016,"y2":560.0284042358398,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":561.7329330444336,"x2":630.7342071533203,"y2":576.2784042358398,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":577.9971542358398,"x2":630.7408599853516,"y2":592.5426254272461,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":594.2613754272461,"x2":632.9002838134766,"y2":608.8067855834961,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":610.5113754272461,"x2":630.2982940673828,"y2":625.0567855834961,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":626.7755355834961,"x2":630.6628570556641,"y2":641.3210067749023,"width":714.3312,"height":1010.2679999999999},{"x1":424.58802795410156,"y1":631.8891830444336,"x2":427.24427795410156,"y2":640.9800643920898,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":643.0397567749023,"x2":632.9015045166016,"y2":657.5852279663086,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":659.2897567749023,"x2":631.0654449462891,"y2":673.8352279663086,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":675.5539779663086,"x2":630.9615020751953,"y2":690.0993881225586,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":691.8039779663086,"x2":632.9170684814453,"y2":706.3493881225586,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":708.0681381225586,"x2":630.9488677978516,"y2":722.6136093139648,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":724.3323593139648,"x2":630.7425689697266,"y2":738.8778305053711,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":740.5823593139648,"x2":630.7351226806641,"y2":755.1278305053711,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":756.8465805053711,"x2":630.5104522705078,"y2":771.3920516967773,"width":714.3312,"height":1010.2679999999999},{"x1":368.72157287597656,"y1":773.1108016967773,"x2":499.5998077392578,"y2":787.6562118530273,"width":714.3312,"height":1010.2679999999999}],"pageNumber":4,"id":2,"articleVersion":1}]`;

  const review1 = await prisma.review.create({
    data: {
      authorId: reviewer.id,
      reviewNumber: 1,
      articleId: article.id,
      published: true,
      organizationId: organization.id,
      rating: 1,
      canAccess: false,
      articleVersion: 1,
      highlights: "[]",
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
      articleVersion: 1,
      body: reviewBody,
      rating: 3,
      highlights: highlights,
    },
  });
  await prisma.threadMessage.create({
    data: {
      reviewId: review2.id,
      userId: andrew.id,
      body: `Author responses and other discussion on public reviews can be viewed in a thread below the review.`,
      articleVersion: 1,
      highlights: "[]",
    },
  });

  const decision = await prisma.decision.create({
    data: {
      authorId: reviewer.id,
      body: `This is an example meta-review. Reviews that a author cites in writing the meta-review are attached to the meta-review. Reviews from other organizations can be cited as well!`,
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
