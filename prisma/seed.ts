import cuid from "cuid";
import prisma from "../lib/prisma";

function createEditorState(text: string) {
  return `{"blocks":[{"key":"q1g7","text":"${text}","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`;
}

async function main() {
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
      id: "m5doYUaWDUP236fnuBdHQzM0ScC2",
      email: "andrew.caines@cl.cam.ac.uk",
      name: "Andrew Caines",
      institution: "University of Cambridge",
    },
  });
  const user2 = await prisma.user.create({
    data: {
      id: cuid(),
      email: "hjc68@cl.cam.ac.uk",
      name: "Hannah Craighead",
      institution: "University of Cambridge",
    },
  });
  const user3 = await prisma.user.create({
    data: {
      id: cuid(),
      email: "paula.buttery@cl.cam.ac.uk",
      name: "Paula Buttery",
      institution: "University of Cambridge",
    },
  });
  const user4 = await prisma.user.create({
    data: {
      id: cuid(),
      email: "hellen.yannakoudakis@cl.cam.ac.uk",
      name: "Helen Yannakoudakis",
      institution: "University of Cambridge",
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
  const jordan = await prisma.user.create({
    data: {
      id: "7T5S1rejsiW3QDu0SZx6R1lXEt82",
      email: "jordan@frontier.pub",
      name: "Jordan Zhang",
      profilePictureUrl: "profile-images/8bac04a4-c5b3-49d5-af11-2e56dd737746",
      website: "github.com/zhzhang",
    },
  });

  const iclr = await prisma.venue.create({
    data: {
      name: "International Conference on Learning Representations",
      abbreviation: "ICLR",
      description: `The International Conference on Learning Representations (ICLR) is the premier gathering of professionals dedicated to the advancement of the branch of artificial intelligence called representation learning, but generally referred to as deep learning. ICLR is globally renowned for presenting and publishing cutting-edge research on all aspects of deep learning used in the fields of artificial intelligence, statistics and data science, as well as important application areas such as machine vision, computational biology, speech recognition, text understanding, gaming, and robotics.`,
      logoRef: "logos/Mt1ozX07_400x400.jpg",
      websiteUrl: "https://iclr.cc/",
      acceptingSubmissions: true,
    },
  });
  const arr = await prisma.venue.create({
    data: {
      name: "ACL Rolling Review",
      abbreviation: "ARR",
      logoRef: "logos/ARR.png",
      websiteUrl: "https://aclrollingreview.org/",
      description:
        "A new rolling review initiative of the Association for Computational Linguistics.",
      acceptingSubmissions: true,
    },
  });

  const abstract =
    "We address the task of automatically grading the language proficiency of spontaneous speech based on textual features from automatic speech recognition transcripts. Motivated by recent advances in multi-task learning, we develop neural networks trained in a multi-task fashion that learn to predict the proficiency level of non-native English speakers by taking advantage of inductive transfer between the main task (grading) and auxiliary prediction tasks: morpho-syntactic labeling, language modeling, and native language identification (L1). We encode the transcriptions with both bi-directional recurrent neural networks and with bi-directional representations from transformers, compare against a feature-rich baseline, and analyse performance at different proficiency levels and with transcriptions of varying error rates. Our best performance comes from a transformer encoder with L1 prediction as an auxiliary task. We discuss areas for improvement and potential applications for text-only speech scoring.";
  const article = await prisma.article.create({
    data: {
      id: "cklgwx4zu000058v2vz52cajm",
      title:
        "Investigating the Effect of Auxiliary Objectives for the Automated Grading of Learner English Speech Transcriptions",
      abstract: abstract,
      authors: {
        create: [
          {
            number: 1,
            context: "AUTHOR",
            user: { connect: { id: user2.id } },
            anonymized: false,
          },
          {
            number: 3,
            context: "AUTHOR",
            user: { connect: { id: user3.id } },
            anonymized: false,
          },
          {
            number: 4,
            context: "AUTHOR",
            user: { connect: { id: user4.id } },
            anonymized: false,
          },
        ],
      },
      versions: {
        create: [
          {
            ref: "https://8clewayepb9hnxbi.public.blob.vercel-storage.com/2020.acl-main.206.pdf",
            versionNumber: 1,
            createdAt: "2020-01-06T12:00:00.000Z",
          },
          {
            ref: "https://8clewayepb9hnxbi.public.blob.vercel-storage.com/2020.acl-main.206.pdf",
            versionNumber: 2,
            createdAt: "2020-06-11T12:00:00.000Z",
          },
        ],
      },
      anonymous: false,
    },
  });
  const andrewAuthorIdentity = await prisma.identity.create({
    data: {
      number: 2,
      context: "AUTHOR",
      user: { connect: { id: andrew.id } },
      article: { connect: { id: article.id } },
      anonymized: false,
    },
  });

  const reviewBody =
    "Easily write your reviews with a fully featured markdown text editor:\n\n - Rich text formatting: *italics* **bold**. \n\n - Formulas $f(x) = x^{2}$ \n $$\nH(p,q)=-\\sum\\limits_{x\\in\\chi}p(x)\\log q(x)\n$$\n - PDF annotation. The following highlight refers to [a section of the introduction]{1} in the most recent version of the article. Making comparisons to different versions of the article is also possible, for example referencing the [auxiliary objectives in the original submission]{2}. Click on the blue highlight link to be taken to highlighted text on a previous version of the article.";
  const highlights = [
    {
      boundingRect: {
        x1: 86,
        y1: 554.8,
        x2: 350.7,
        y2: 683.2,
        width: 714.3,
        height: 1010.3,
      },
      rects: [
        {
          x1: 99.5,
          y1: 554.8,
          x2: 348.4,
          y2: 569.4,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 86.4,
          y1: 571.1,
          x2: 347.8,
          y2: 585.6,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 86.4,
          y1: 587.3,
          x2: 348.9,
          y2: 601.9,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 86.4,
          y1: 603.6,
          x2: 348.4,
          y2: 618.2,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 86.4,
          y1: 619.9,
          x2: 350.7,
          y2: 634.4,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 86,
          y1: 636.1,
          x2: 348.4,
          y2: 650.7,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 86.4,
          y1: 652.4,
          x2: 348.4,
          y2: 666.9,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 86.4,
          y1: 668.6,
          x2: 340.5,
          y2: 683.2,
          width: 714.3,
          height: 1010.3,
        },
      ],
      pageNumber: 2,
      id: 1,
      articleVersion: 2,
      text: "placeholder",
    },
    {
      boundingRect: {
        x1: 368.3,
        y1: 512.8,
        x2: 632.9,
        y2: 787.7,
        width: 714.3,
        height: 1010.3,
      },
      rects: [
        {
          x1: 368.3,
          y1: 512.8,
          x2: 630.7,
          y2: 527.3,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 529.2,
          x2: 630.7,
          y2: 543.8,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.3,
          y1: 545.5,
          x2: 632.4,
          y2: 560,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 561.7,
          x2: 630.7,
          y2: 576.3,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 578,
          x2: 630.7,
          y2: 592.5,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 594.3,
          x2: 632.9,
          y2: 608.8,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 610.5,
          x2: 630.3,
          y2: 625.1,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 626.8,
          x2: 630.7,
          y2: 641.3,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 424.6,
          y1: 631.9,
          x2: 427.2,
          y2: 641,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 643,
          x2: 632.9,
          y2: 657.6,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 659.3,
          x2: 631.1,
          y2: 673.8,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 675.6,
          x2: 631,
          y2: 690.1,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 691.8,
          x2: 632.9,
          y2: 706.3,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 708.1,
          x2: 630.9,
          y2: 722.6,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 724.3,
          x2: 630.7,
          y2: 738.9,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 740.6,
          x2: 630.7,
          y2: 755.1,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 756.8,
          x2: 630.5,
          y2: 771.4,
          width: 714.3,
          height: 1010.3,
        },
        {
          x1: 368.7,
          y1: 773.1,
          x2: 499.6,
          y2: 787.7,
          width: 714.3,
          height: 1010.3,
        },
      ],
      pageNumber: 4,
      id: 2,
      articleVersion: 1,
      text: "placeholder",
    },
  ];

  const review2 = await prisma.threadMessage.create({
    data: {
      type: "REVIEW",
      authorIdentity: {
        create: {
          user: {
            connect: {
              id: reviewer.id,
            },
          },
          article: {
            connect: {
              id: article.id,
            },
          },
          venue: {
            connect: {
              id: arr.id,
            },
          },
          context: "REVIEWER",
          number: 1,
        },
      },
      author: {
        connect: {
          id: reviewer.id,
        },
      },
      published: true,
      publishTimestamp: new Date("2021-10-20T12:00:00"),
      article: {
        connect: {
          id: article.id,
        },
      },
      body: reviewBody,
      rating: 3,
      highlights: highlights,
    },
  });
  await prisma.threadMessage.create({
    data: {
      type: "COMMENT",
      article: {
        connect: {
          id: article.id,
        },
      },
      headId: review2.id,
      authorIdentity: {
        create: {
          user: {
            connect: {
              id: jordan.id,
            },
          },
          article: {
            connect: {
              id: article.id,
            },
          },
          number: 0,
          anonymized: false,
        },
      },
      author: {
        connect: {
          id: jordan.id,
        },
      },
      body: `Author responses and other discussion on public reviews can be viewed in a thread below the review.`,
      highlights: [],
      published: true,
      publishTimestamp: new Date("2021-10-20T14:00:00"),
    },
  });

  const decision = await prisma.threadMessage.create({
    data: {
      type: "DECISION",
      authorIdentity: {
        create: {
          number: 1,
          user: {
            connect: {
              id: reviewer.id,
            },
          },
          article: {
            connect: {
              id: article.id,
            },
          },
          venue: {
            connect: {
              id: arr.id,
            },
          },
          context: "CHAIR",
        },
      },
      author: {
        connect: {
          id: reviewer.id,
        },
      },
      body: `This is an example meta-review.`,
      published: true,
      publishTimestamp: new Date("2021-11-20T12:00:00"),
      highlights: [],
      venue: {
        connect: {
          id: arr.id,
        },
      },
      decision: true,
      article: {
        connect: {
          id: article.id,
        },
      },
    },
  });

  // Second Article
  const article2 = await prisma.article.create({
    data: {
      title: "Grammatical Error Detection in Transcriptions of Spoken English",
      abstract:
        "We describe the collection of transcription corrections and grammatical error annotations for the CROWDED Corpus of spoken English monologues on business topics. The corpus recordings were crowdsourced from native speakers of English and learners of English with German as their first language. The new transcriptions and annotations are obtained from different crowdworkers: we analyse the 1108 new crowdworker submissions and propose that they can be used for automatic transcription post-editing and grammatical error correction for speech. To further explore the data we train grammatical error detection models with various configurations including pretrained and contextual word representations as input, additional features and auxiliary objectives, and extra training data from written error-annotated corpora. We find that a model concatenating pre-trained and contextual word representations as input performs best, and that additional information does not lead to further performance gains",
      authors: {
        create: [
          {
            number: 1,
            context: "AUTHOR",
            user: { connect: { id: andrew.id } },
          },
          { number: 2, context: "AUTHOR", user: { connect: { id: user5.id } } },
          { number: 3, context: "AUTHOR", user: { connect: { id: user6.id } } },
          { number: 4, context: "AUTHOR", user: { connect: { id: user7.id } } },
          { number: 5, context: "AUTHOR", user: { connect: { id: user3.id } } },
        ],
      },
      versions: {
        create: [
          {
            ref: "articles/CrowdED_GED.pdf",
            versionNumber: 1,
            createdAt: "2020-01-06T12:00:00.000Z",
          },
        ],
      },
      anonymous: true,
    },
  });

  await prisma.venue.create({
    data: {
      name: "Conference of the North American Chapter of the Association for Computational Linguistics",
      abbreviation: "NAACL",
      logoRef: "logos/b501498d-a03f-4e8d-9aaf-0d5068cd59cd",
      websiteUrl: "https://naacl.org/",
      description:
        "The North American Chapter of the Association for Computational Linguistics (NAACL) provides a regional focus for members of the Association for Computational Linguistics (ACL) in North America as well as in Central and South America, organizes annual conferences, promotes cooperation and information exchange among related scientific and professional societies, encourages and facilitates ACL membership by people and institutions in the Americas, and provides a source of information on regional activities for the ACL Executive Committee.",
      submissionDeadline: "2022-06-05T10:00:00.000Z",
      venueDate: "2022-06-10T10:00:00.000Z",
      acceptingSubmissions: true,
    },
  });

  await prisma.venue.create({
    data: {
      name: "Conference on Empirical Methods in Natural Language Processing",
      abbreviation: "EMNLP",
      logoRef: "logos/b501498d-a03f-4e8d-9aaf-0d5068cd59cd",
      websiteUrl: "https://2020.emnlp.org",
      description:
        "The 2021 Conference on Empirical Methods in Natural Language Processing (EMNLP 2021) invites the submission of long and short papers on substantial, original, and unpublished research in empirical methods for Natural Language Processing. As in recent years, some of the presentations at the conference will be for papers accepted by the Transactions of the ACL (TACL) and Computational Linguistics (CL) journals.",
      submissionDeadline: "2021-05-17T10:00:00.000Z",
      venueDate: "2021-11-07T10:00:00.000Z",
    },
  });

  const pastACL = await prisma.venue.create({
    data: {
      name: "Annual Meeting of the Association for Computational Linguistics",
      abbreviation: "ACL",
      logoRef: "logos/b501498d-a03f-4e8d-9aaf-0d5068cd59cd",
      websiteUrl: "https://acl2020.org/",
      description:
        "ACL is the premier conference of the field of computational linguistics, covering a broad spectrum of diverse research areas that are concerned with computational approaches to natural language.",
      submissionDeadline: "2020-06-05T10:00:00.000Z",
      venueDate: "2020-06-10T10:00:00.000Z",
    },
  });

  await prisma.threadMessage.create({
    data: {
      type: "DECISION",
      authorIdentity: {
        create: {
          number: 2,
          user: {
            connect: {
              id: reviewer.id,
            },
          },
          article: {
            connect: {
              id: article.id,
            },
          },
          venue: {
            connect: {
              id: pastACL.id,
            },
          },
          context: "CHAIR",
        },
      },
      author: {
        connect: {
          id: reviewer.id,
        },
      },
      body: `Articles can be accepted by multiple venues, meaning that transactions or rolling-review papers may be selected based on prior reviews to be featured at conferences.`,
      highlights: [],
      venue: {
        connect: {
          id: pastACL.id,
        },
      },
      published: true,
      publishTimestamp: new Date("2021-11-27T12:00:00"),
      decision: true,
      article: {
        connect: {
          id: article.id,
        },
      },
    },
  });

  await prisma.venue.create({
    data: {
      name: "Conference of the North American Chapter of the Association for Computational Linguistics",
      abbreviation: "NAACL",
      logoRef: "logos/b501498d-a03f-4e8d-9aaf-0d5068cd59cd",
      websiteUrl: "https://naacl.org/",
      description:
        "The North American Chapter of the Association for Computational Linguistics (NAACL) provides a regional focus for members of the Association for Computational Linguistics (ACL) in North America as well as in Central and South America, organizes annual conferences, promotes cooperation and information exchange among related scientific and professional societies, encourages and facilitates ACL membership by people and institutions in the Americas, and provides a source of information on regional activities for the ACL Executive Committee.",
      submissionDeadline: "2020-06-05T10:00:00.000Z",
      venueDate: "2020-06-10T10:00:00.000Z",
    },
  });

  await prisma.venue.create({
    data: {
      name: "Conference on Empirical Methods in Natural Language Processing",
      websiteUrl: "https://2021.emnlp.org",
      logoRef: "logos/b501498d-a03f-4e8d-9aaf-0d5068cd59cd",
      abbreviation: "EMNLP",
      description:
        "The Conference on Empirical Methods in Natural Language Processing invites the submission of long and short papers on substantial, original, and unpublished research in empirical methods for Natural Language Processing. As in recent years, some of the presentations at the conference will be for papers accepted by the Transactions of the ACL (TACL) and Computational Linguistics (CL) journals.",
      submissionDeadline: "2020-05-17T10:00:00.000Z",
      venueDate: "2020-11-07T10:00:00.000Z",
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
